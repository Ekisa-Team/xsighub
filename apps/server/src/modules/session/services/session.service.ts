import { generateKey } from '@lib/helpers';
import { XsighubLoggerService } from '@lib/logger';
import { PrismaService } from '@lib/prisma';
import { ApiExtras } from '@lib/types/api-extras';
import { Injectable } from '@nestjs/common';
import { SessionDto } from '../dtos/session.dto';
import { sessionExceptions } from '../exceptions/session.exceptions';
import { SessionGateway } from '../gateways/session.gateway';

@Injectable()
export class SessionService {
    constructor(
        private readonly _logger: XsighubLoggerService,
        private readonly _prisma: PrismaService,
        private readonly _sessionGateway: SessionGateway,
    ) {
        this._logger.setContext(this.constructor.name);
    }

    async create(
        clientIp: string,
        userAgent: string,
        { correlationId }: ApiExtras,
    ): Promise<SessionDto> {
        this._logger.info(`[${this.create.name}]`, { correlationId });

        const session = await this._prisma.session.findFirst({
            where: {
                connection: { clientIp },
            },
        });

        if (session) {
            throw new sessionExceptions.SessionAlreadyCreatedByIp({ clientIp });
        }

        const created = await this._prisma.session.create({
            data: {
                pairingKey: generateKey(6).toString(),
                connection: {
                    create: {
                        clientIp,
                        userAgent,
                    },
                },
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

        this._sessionGateway.handleSessionCreated(created, {
            correlationId,
        });

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

    async pair(pairingKey: string, { correlationId }: ApiExtras): Promise<SessionDto> {
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

        await this._sessionGateway.handleSessionPaired(updated, {
            correlationId,
        });

        return updated;
    }

    async unpair(pairingKey: string, { correlationId }: ApiExtras): Promise<SessionDto> {
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

        await this._sessionGateway.handleSessionUnpaired(updated, {
            correlationId,
        });

        return updated;
    }

    async destroy(clientIp: string, { correlationId }: ApiExtras): Promise<SessionDto> {
        this._logger.info(`[${this.destroy.name}]`, { correlationId });

        const session = await this._prisma.session.findFirst({
            where: {
                connection: {
                    clientIp,
                },
            },
        });

        if (!session) {
            throw new sessionExceptions.SessionNotFoundByClientIp({ clientIp });
        }

        const destroyed = await this._prisma.session.delete({
            where: {
                pairingKey: session.pairingKey,
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

        await this._sessionGateway.handleSessionDestroyed(destroyed, {
            correlationId,
        });

        return destroyed;
    }
}
