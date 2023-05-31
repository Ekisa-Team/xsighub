import { XsighubLoggerService } from '@lib/logger';
import { PrismaService } from '@lib/prisma';
import { ApiExtras } from '@lib/types/api-extras';
import { Injectable, NotFoundException } from '@nestjs/common';
import {
    SessionReferenceCreateDto,
    SessionReferenceDto,
    SessionReferenceUpdateDto,
} from '../dtos/session-reference.dto';
import { SessionReferenceType } from '../enums/session-reference.enum';
import { SessionGateway } from '../gateways/session.gateway';
import { SessionService } from './session.service';

@Injectable()
export class SessionReferenceService {
    constructor(
        private readonly _logger: XsighubLoggerService,
        private readonly _prisma: PrismaService,
        private readonly _sessionService: SessionService,
        private readonly _sessionGateway: SessionGateway,
    ) {
        this._logger.setContext(this.constructor.name);
    }

    async create(
        data: SessionReferenceCreateDto,
        { correlationId }: ApiExtras,
    ): Promise<SessionReferenceDto> {
        this._logger.info(`[${this.create.name}]`, { correlationId });

        const session = await this._prisma.session.findUnique({
            include: {
                references: true,
            },
            where: {
                id: data.sessionId,
            },
        });

        if (!session) {
            throw new NotFoundException(
                `The session associated with the ID ${data.sessionId} could not be found.`,
            );
        }

        if (
            data.type === SessionReferenceType.Standalone &&
            session.references.some((ref) => ref.type === SessionReferenceType.Standalone)
        ) {
            throw new NotFoundException(
                `There can only be a single standalone reference per session.`,
            );
        }

        const created = await this._prisma.sessionReference.create({ data });

        this._sessionGateway.handleSessionUpdated(
            await this._sessionService.findById(created.sessionId, { correlationId }),
            {
                correlationId,
            },
        );

        return created;
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

        const updated = await this._prisma.sessionReference.update({
            data,
            where: { id: referenceId },
        });

        this._sessionGateway.handleSessionUpdated(
            await this._sessionService.findById(updated.sessionId, { correlationId }),
            {
                correlationId,
            },
        );

        return updated;
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

        const deleted = await this._prisma.sessionReference.delete({
            where: {
                id: referenceId,
            },
        });

        this._sessionGateway.handleSessionUpdated(
            await this._sessionService.findById(deleted.sessionId, { correlationId }),
            {
                correlationId,
            },
        );

        return deleted;
    }
}
