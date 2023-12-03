import { XsighubLoggerService } from '@lib/logger';
import { PrismaService } from '@lib/prisma';
import { ApiExtras } from '@lib/types/api-extras';
import { Injectable } from '@nestjs/common';
import {
    SessionDocumentCreateDto,
    SessionDocumentDto,
    SessionDocumentMetadataLoadDto,
    SessionDocumentSignatureCreateDto,
    SessionDocumentUpdateDto,
} from '../dtos/session-document.dto';
import { sessionDocumentExceptions } from '../exceptions/session-document.exceptions';
import { sessionReferenceExceptions } from '../exceptions/session-reference.exceptions';
import { SessionGateway } from '../gateways/session.gateway';
import { SessionService } from './session.service';

@Injectable()
export class SessionDocumentService {
    constructor(
        private readonly _logger: XsighubLoggerService,
        private readonly _prisma: PrismaService,
        private readonly _sessionService: SessionService,
        private readonly _sessionGateway: SessionGateway,
    ) {
        this._logger.setContext(this.constructor.name);
    }

    async create(data: SessionDocumentCreateDto, { correlationId }: ApiExtras): Promise<SessionDocumentDto> {
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

        const created = await this._prisma.sessionDocument.create({ data });

        this._sessionGateway.handleSessionUpdated(
            await this._sessionService.updateTimestamp(reference.sessionId, {
                correlationId,
            }),
            {
                correlationId,
            },
            {
                source: 'document',
                action: 'create',
                data: created,
            },
        );

        return created;
    }

    async findById(documentId: number, { correlationId }: ApiExtras): Promise<SessionDocumentDto> {
        this._logger.info(`[${this.findById.name}]`, { correlationId });

        const document = await this._prisma.sessionDocument.findFirst({
            where: {
                id: documentId,
            },
        });

        if (!document) {
            throw new sessionDocumentExceptions.SessionDocumentNotFoundById({ documentId });
        }

        return document;
    }

    async update(
        documentId: number,
        data: SessionDocumentUpdateDto,
        { correlationId }: ApiExtras,
    ): Promise<SessionDocumentDto> {
        this._logger.info(`[${this.update.name}]`, { correlationId });

        const document = await this._prisma.sessionDocument.findUnique({
            where: {
                id: documentId,
            },
        });

        if (!document) {
            throw new sessionDocumentExceptions.SessionDocumentNotFoundById({ documentId });
        }

        const updated = await this._prisma.sessionDocument.update({
            data,
            where: { id: documentId },
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
                source: 'document',
                action: 'update',
                data: updated,
            },
        );

        return updated;
    }

    async attachSignature(
        documentId: number,
        data: SessionDocumentSignatureCreateDto,
        { correlationId }: ApiExtras,
    ): Promise<SessionDocumentDto> {
        this._logger.info(`[${this.update.name}]`, { correlationId });

        const document = await this._prisma.sessionDocument.findUnique({
            include: {
                reference: true,
            },
            where: {
                id: documentId,
            },
        });

        if (!document) {
            throw new sessionDocumentExceptions.SessionDocumentNotFoundById({ documentId });
        }

        const pattern = new RegExp(`\\[signature:${data.signatureName}\\]\\((.*?)\\)`, 'g');

        const matches = document.rawContent.match(pattern);

        if (!matches) {
            throw new sessionDocumentExceptions.SessionDocumentSignatureNotFoundByName({
                signatureName: data.signatureName,
            });
        }

        let documentContent = document.rawContent;

        for (const match of matches) {
            documentContent = documentContent.replace(
                match,
                `![signature:${data.signatureName}](${data.signatureData})`,
            );

            await this._prisma.sessionDocument.update({
                data: {
                    rawContent: documentContent,
                },
                where: {
                    id: documentId,
                },
            });
        }

        this._sessionGateway.handleSessionUpdated(
            await this._sessionService.updateTimestamp(document.reference.sessionId, {
                correlationId,
            }),
            {
                correlationId,
            },
            {
                source: 'document',
                action: 'update',
                data: document,
            },
        );

        return document;
    }

    async loadMetadata(
        documentId: number,
        { ingest }: SessionDocumentMetadataLoadDto,
        { correlationId }: ApiExtras,
    ): Promise<SessionDocumentDto> {
        this._logger.info(`[${this.loadMetadata.name}]`, { correlationId });

        const document = await this._prisma.sessionDocument.findUnique({
            where: {
                id: documentId,
            },
        });

        if (!document) {
            throw new sessionDocumentExceptions.SessionDocumentNotFoundById({ documentId });
        }

        const updated = await this._prisma.sessionDocument.update({
            data: {
                metadata: JSON.stringify(ingest),
            },
            where: {
                id: documentId,
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
                source: 'document',
                action: 'update',
                data: updated,
            },
        );

        return updated;
    }

    async delete(documentId: number, { correlationId }: ApiExtras): Promise<SessionDocumentDto> {
        this._logger.info(`[${this.delete.name}]`, { correlationId });

        const document = await this._prisma.sessionDocument.findUnique({
            where: {
                id: documentId,
            },
        });

        if (!document) {
            throw new sessionDocumentExceptions.SessionDocumentNotFoundById({ documentId });
        }

        const deleted = await this._prisma.sessionDocument.delete({
            where: {
                id: documentId,
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
                source: 'document',
                action: 'delete',
                data: deleted,
            },
        );

        return deleted;
    }
}
