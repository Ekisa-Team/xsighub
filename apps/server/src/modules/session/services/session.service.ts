import { XsighubConfigService } from '@lib/config';
import { generateKey } from '@lib/helpers';
import { XsighubLoggerService } from '@lib/logger';
import { PrismaService } from '@lib/prisma';
import { ApiExtras } from '@lib/types/api-extras';
import { Injectable } from '@nestjs/common';
import ms from 'ms';
import { SessionDto } from '../dtos/session.dto';
import { sessionExceptions } from '../exceptions/session.exceptions';
import { SessionGateway } from '../gateways/session.gateway';

@Injectable()
export class SessionService {
    constructor(
        private readonly _logger: XsighubLoggerService,
        private readonly _config: XsighubConfigService,
        private readonly _prisma: PrismaService,
        private readonly _sessionGateway: SessionGateway,
    ) {
        this._logger.setContext(this.constructor.name);
    }

    async create(
        clientIp: string,
        userAgent: string,
        { correlationId, clientId }: ApiExtras,
    ): Promise<SessionDto> {
        this._logger.info(`[${this.create.name}]`, { correlationId });

        const created = await this._prisma.session.create({
            data: {
                pairingKey: generateKey(6),
                connection: {
                    create: {
                        clientIp,
                        userAgent,
                    },
                },
            },
        });

        this._sessionGateway.handleSessionCreated(
            await this.updateTimestamp(created.id, { correlationId, clientId }),
            {
                correlationId,
                clientId,
            },
        );

        return created;
    }

    async findById(sessionId: number, { correlationId }: ApiExtras): Promise<SessionDto> {
        this._logger.info(`[${this.findById.name}]`, { correlationId });

        const session = await this._prisma.session.findFirst({
            include: {
                connection: true,
                references: {
                    include: {
                        signatures: true,
                        documents: true,
                    },
                },
            },
            where: {
                id: sessionId,
            },
        });

        if (!session) {
            throw new sessionExceptions.SessionNotFoundById({ sessionId });
        }

        return session;
    }

    async findByIpAddress(clientIp: string, { correlationId }: ApiExtras): Promise<SessionDto> {
        this._logger.info(`[${this.findByPairingKey.name}]`, { correlationId });

        const session = await this._prisma.session.findFirst({
            include: {
                connection: true,
                references: {
                    include: {
                        signatures: true,
                        documents: true,
                    },
                },
            },
            where: {
                connection: {
                    clientIp,
                },
            },
        });

        if (!session) {
            throw new sessionExceptions.SessionNotFoundByClientIp({ clientIp });
        }

        return session;
    }

    async findByPairingKey(pairingKey: string, { correlationId }: ApiExtras): Promise<SessionDto> {
        this._logger.info(`[${this.findByPairingKey.name}]`, { correlationId });

        const session = await this._prisma.session.findUnique({
            include: {
                connection: true,
                references: {
                    include: {
                        signatures: true,
                        documents: true,
                    },
                },
            },
            where: { pairingKey },
        });

        if (!session) {
            throw new sessionExceptions.SessionNotFoundByPairingKey({ pairingKey });
        }

        return session;
    }

    async pair(pairingKey: string, { correlationId, clientId }: ApiExtras): Promise<SessionDto> {
        this._logger.info(`[${this.unpair.name}]`, { correlationId });

        const session = await this._prisma.session.findFirst({
            include: {
                connection: true,
            },
            where: {
                pairingKey,
            },
        });

        if (!session) {
            throw new sessionExceptions.SessionNotFoundByPairingKey({ pairingKey });
        }

        const updated = await this._prisma.session.update({
            data: {
                connection: {
                    update: {
                        isPaired: true,
                        pairedAt: new Date(),
                    },
                },
            },
            where: {
                pairingKey,
            },
        });

        await this._sessionGateway.handleSessionPaired(
            await this.updateTimestamp(updated.id, { correlationId, clientId }),
            {
                correlationId,
                clientId,
            },
        );

        return updated;
    }

    async unpair(pairingKey: string, { correlationId, clientId }: ApiExtras): Promise<SessionDto> {
        this._logger.info(`[${this.unpair.name}]`, { correlationId });

        const session = await this._prisma.session.findFirst({
            include: {
                connection: true,
            },
            where: {
                pairingKey,
            },
        });

        if (!session) {
            throw new sessionExceptions.SessionNotFoundByPairingKey({ pairingKey });
        }

        const updated = await this._prisma.session.update({
            data: {
                connection: {
                    update: {
                        isPaired: false,
                        pairedAt: null,
                    },
                },
            },
            where: {
                pairingKey,
            },
        });

        await this._sessionGateway.handleSessionUnpaired(
            await this.updateTimestamp(updated.id, { correlationId, clientId }),
            {
                correlationId,
                clientId,
            },
        );

        return updated;
    }

    async updateTimestamp(sessionId: number, { correlationId }: ApiExtras): Promise<SessionDto> {
        this._logger.info(`[${this.updateTimestamp.name}]`, { correlationId });

        const session = await this._prisma.session.findUnique({
            where: {
                id: sessionId,
            },
        });

        if (!session) {
            throw new sessionExceptions.SessionNotFoundById({ sessionId });
        }

        return this._prisma.session.update({
            data: {
                updatedAt: new Date(),
            },
            where: {
                id: sessionId,
            },
            include: {
                connection: true,
                references: {
                    include: {
                        signatures: true,
                        documents: true,
                    },
                },
            },
        });
    }

    async destroy(pairingKey: string, extras?: ApiExtras): Promise<SessionDto> {
        this._logger.info(`[${this.destroy.name}]`, { correlationId: extras?.correlationId });

        const session = await this._prisma.session.findUnique({
            where: {
                pairingKey,
            },
        });

        if (!session) {
            throw new sessionExceptions.SessionNotFoundByPairingKey({ pairingKey });
        }

        const destroyed = await this._prisma.session.delete({
            where: {
                pairingKey: session.pairingKey,
            },
        });

        await this._sessionGateway.handleSessionDestroyed(destroyed, {
            correlationId: extras?.correlationId,
            clientId: extras?.clientId,
        });

        return destroyed;
    }

    async cleanup(): Promise<{ cleanedUp: SessionDto[] }> {
        console.log(this._config.app.xsighub.cleanupSessionInterval);

        const inactivityThreshold = new Date(
            Date.now() - ms(this._config.app.xsighub.cleanupSessionInterval),
        );

        const inactiveSessions = await this._prisma.session.findMany({
            where: {
                updatedAt: {
                    lt: inactivityThreshold,
                },
            },
        });

        const cleanedUp = await Promise.all(
            inactiveSessions.map((session) => this.destroy(session.pairingKey)),
        );

        return { cleanedUp };
    }
}
