import { XsighubLoggerService } from '@lib/logger';
import { PrismaService } from '@lib/prisma';
import { ApiExtras } from '@lib/types/api-extras';
import { Injectable } from '@nestjs/common';
import {
    SessionReferenceCreateDto,
    SessionReferenceDto,
    SessionReferenceUpdateDto,
} from '../dtos/session-reference.dto';
import { SessionReferenceType } from '../enums/session-reference.enum';
import { sessionReferenceExceptions } from '../exceptions/session-reference.exceptions';
import { sessionExceptions } from '../exceptions/session.exceptions';
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
            throw new sessionExceptions.SessionNotFoundById({ sessionId: data.sessionId });
        }

        if (
            data.type === SessionReferenceType.Standalone &&
            session.references.some((ref) => ref.type === SessionReferenceType.Standalone)
        ) {
            throw new sessionReferenceExceptions.SessionReferenceUniqueStandalone();
        }

        const created = await this._prisma.sessionReference.create({ data });

        this._sessionGateway.handleSessionUpdated(
            await this._sessionService.updateTimestamp(created.sessionId, {
                correlationId,
            }),
            {
                correlationId,
            },
            {
                source: 'reference',
                action: 'create',
                data: created,
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
            throw new sessionReferenceExceptions.SessionReferenceNotFoundById({ referenceId });
        }

        const updated = await this._prisma.sessionReference.update({
            data,
            where: { id: referenceId },
        });

        this._sessionGateway.handleSessionUpdated(
            await this._sessionService.updateTimestamp(updated.sessionId, {
                correlationId,
            }),
            {
                correlationId,
            },
            {
                source: 'reference',
                action: 'update',
                data: updated,
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
            throw new sessionReferenceExceptions.SessionReferenceNotFoundById({ referenceId });
        }

        const deleted = await this._prisma.sessionReference.delete({
            where: {
                id: referenceId,
            },
        });

        this._sessionGateway.handleSessionUpdated(
            await this._sessionService.updateTimestamp(deleted.sessionId, {
                correlationId,
            }),
            {
                correlationId,
            },
            {
                source: 'reference',
                action: 'delete',
                data: deleted,
            },
        );

        return deleted;
    }
}
