import { XsighubLoggerService } from '@lib/logger';
import { PrismaService } from '@lib/prisma';
import { ApiExtras } from '@lib/types/api-extras';
import { Injectable } from '@nestjs/common';
import {
    SessionSignatureCreateDto,
    SessionSignatureDto,
    SessionSignatureMetadataLoadDto,
    SessionSignatureUpdateDto,
} from '../dtos/session-signature.dto';
import { sessionReferenceExceptions } from '../exceptions/session-reference.exceptions';
import { sessionSignatureExceptions } from '../exceptions/session-signature.exceptions';
import { SessionGateway } from '../gateways/session.gateway';
import { SessionService } from './session.service';

@Injectable()
export class SessionSignatureService {
    constructor(
        private readonly _logger: XsighubLoggerService,
        private readonly _prisma: PrismaService,
        private readonly _sessionService: SessionService,
        private readonly _sessionGateway: SessionGateway,
    ) {
        this._logger.setContext(this.constructor.name);
    }

    async create(
        data: SessionSignatureCreateDto,
        { correlationId }: ApiExtras,
    ): Promise<SessionSignatureDto> {
        this._logger.info(`[${this.create.name}]`, { correlationId });

        const reference = await this._prisma.sessionReference.findUnique({
            where: {
                id: data.referenceId,
            },
        });

        if (!reference) {
            throw new sessionReferenceExceptions.SessionReferenceNotFoundById({
                referenceId: data.referenceId,
            });
        }

        const created = await this._prisma.sessionSignature.create({ data });

        this._sessionGateway.handleSessionUpdated(
            await this._sessionService.updateTimestamp(reference.sessionId, {
                correlationId,
            }),
            {
                correlationId,
            },
            {
                source: 'signature',
                action: 'create',
                data: created,
            },
        );

        return created;
    }

    async findById(
        signatureId: number,
        { correlationId }: ApiExtras,
    ): Promise<SessionSignatureDto> {
        this._logger.info(`[${this.findById.name}]`, { correlationId });

        const signature = await this._prisma.sessionSignature.findFirst({
            where: {
                id: signatureId,
            },
        });

        if (!signature) {
            throw new sessionSignatureExceptions.SessionSignatureNotFoundById({ signatureId });
        }

        return signature;
    }

    async update(
        signatureId: number,
        data: SessionSignatureUpdateDto,
        { correlationId }: ApiExtras,
    ): Promise<SessionSignatureDto> {
        this._logger.info(`[${this.update.name}]`, { correlationId });

        const signature = await this._prisma.sessionSignature.findUnique({
            where: {
                id: signatureId,
            },
        });

        if (!signature) {
            throw new sessionSignatureExceptions.SessionSignatureNotFoundById({ signatureId });
        }

        const updated = await this._prisma.sessionSignature.update({
            data,
            where: { id: signatureId },
            include: {
                reference: true,
            },
        });

        this._sessionGateway.handleSessionUpdated(
            await this._sessionService.updateTimestamp(updated.reference.sessionId, {
                correlationId,
            }),
            {
                correlationId,
            },
            {
                source: 'signature',
                action: 'update',
                data: updated,
            },
        );

        return updated;
    }

    async loadMetadata(
        signatureId: number,
        { ingest }: SessionSignatureMetadataLoadDto,
        { correlationId }: ApiExtras,
    ): Promise<SessionSignatureDto> {
        this._logger.info(`[${this.loadMetadata.name}]`, { correlationId });

        const signature = await this._prisma.sessionSignature.findUnique({
            where: {
                id: signatureId,
            },
        });

        if (!signature) {
            throw new sessionSignatureExceptions.SessionSignatureNotFoundById({ signatureId });
        }

        const updated = await this._prisma.sessionSignature.update({
            data: {
                metadata: ingest,
            },
            where: {
                id: signatureId,
            },
            include: {
                reference: true,
            },
        });

        this._sessionGateway.handleSessionUpdated(
            await this._sessionService.updateTimestamp(updated.reference.sessionId, {
                correlationId,
            }),
            {
                correlationId,
            },
            {
                source: 'signature',
                action: 'update',
                data: updated,
            },
        );

        return updated;
    }

    async delete(signatureId: number, { correlationId }: ApiExtras): Promise<SessionSignatureDto> {
        this._logger.info(`[${this.delete.name}]`, { correlationId });

        const signature = await this._prisma.sessionSignature.findUnique({
            where: {
                id: signatureId,
            },
        });

        if (!signature) {
            throw new sessionSignatureExceptions.SessionSignatureNotFoundById({ signatureId });
        }

        const deleted = await this._prisma.sessionSignature.delete({
            where: {
                id: signatureId,
            },
            include: {
                reference: true,
            },
        });

        this._sessionGateway.handleSessionUpdated(
            await this._sessionService.updateTimestamp(deleted.reference.sessionId, {
                correlationId,
            }),
            {
                correlationId,
            },
            {
                source: 'signature',
                action: 'delete',
                data: deleted,
            },
        );

        return deleted;
    }
}
