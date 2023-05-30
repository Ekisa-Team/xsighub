import { generateKey } from '@lib/helpers';
import { XsighubLoggerService } from '@lib/logger';
import { PrismaService } from '@lib/prisma';
import { ApiExtras } from '@lib/types/api-extras';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { SessionDto } from '../dtos/session.dto';

@Injectable()
export class SessionService {
    constructor(
        private readonly _logger: XsighubLoggerService,
        private readonly _prisma: PrismaService,
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

        console.log({ session });

        if (session) {
            throw new BadRequestException(
                `The IP address ${clientIp} has an existing session. Please ensure that you destroy any existing session before attempting to create a new one.`,
            );
        }

        return this._prisma.session.create({
            data: {
                pairingKey: generateKey(6).toString(),
                connection: {
                    create: {
                        clientIp,
                        userAgent,
                    },
                },
            },
        });
    }

    async findByIpAddress(clientIp: string, { correlationId }: ApiExtras): Promise<SessionDto> {
        this._logger.info(`[${this.findByPairingKey.name}]`, { correlationId });

        const session = await this._prisma.session.findFirst({
            include: {
                connection: true,
                references: {
                    include: {
                        signatures: true,
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
            throw new NotFoundException(
                `The session associated with the IP address ${clientIp} could not be found.`,
            );
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
                    },
                },
            },
            where: { pairingKey },
        });

        if (!session) {
            throw new NotFoundException(
                `The session associated with the pairing key ${pairingKey} could not be found.`,
            );
        }

        return session;
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
            throw new NotFoundException(
                `The IP address ${clientIp} doesn't have any associated sessions to be destroyed.`,
            );
        }

        return this._prisma.session.delete({
            where: {
                pairingKey: session.pairingKey,
            },
        });
    }
}
