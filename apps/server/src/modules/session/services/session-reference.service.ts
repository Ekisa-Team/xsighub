import { XsighubLoggerService } from '@lib/logger';
import { PrismaService } from '@lib/prisma';
import { ApiExtras } from '@lib/types/api-extras';
import { Injectable, NotFoundException } from '@nestjs/common';
import {
    SessionReferenceCreateDto,
    SessionReferenceDto,
    SessionReferenceUpdateDto,
} from '../dtos/session-reference.dto';

@Injectable()
export class SessionReferenceService {
    constructor(
        private readonly _logger: XsighubLoggerService,
        private readonly _prisma: PrismaService,
    ) {
        this._logger.setContext(this.constructor.name);
    }

    async create(
        data: SessionReferenceCreateDto,
        { correlationId }: ApiExtras,
    ): Promise<SessionReferenceDto> {
        this._logger.info(`[${this.create.name}]`, { correlationId });

        const session = await this._prisma.session.findUnique({
            where: {
                id: data.sessionId,
            },
        });

        if (!session) {
            throw new NotFoundException(
                `The session associated with the ID ${data.sessionId} could not be found.`,
            );
        }

        return this._prisma.sessionReference.create({ data });
    }

    async update(
        referenceId: number,
        data: SessionReferenceUpdateDto,
        { correlationId }: ApiExtras,
    ): Promise<SessionReferenceDto> {
        this._logger.info(`[${this.update.name}]`, { correlationId });

        const reference = await this._prisma.sessionReference.findUnique({
            where: {
                id: referenceId,
            },
        });

        if (!reference) {
            throw new NotFoundException(
                `The reference associated with the ID ${referenceId} could not be found.`,
            );
        }

        return this._prisma.sessionReference.update({
            data,
            where: { id: referenceId },
        });
    }

    async delete(referenceId: number, { correlationId }: ApiExtras): Promise<SessionReferenceDto> {
        this._logger.info(`[${this.delete.name}]`, { correlationId });

        const reference = await this._prisma.sessionReference.findUnique({
            where: {
                id: referenceId,
            },
        });

        if (!reference) {
            throw new NotFoundException(
                `The reference associated with the ID ${referenceId} could not be found.`,
            );
        }

        return this._prisma.sessionReference.delete({
            where: {
                id: referenceId,
            },
        });
    }
}
