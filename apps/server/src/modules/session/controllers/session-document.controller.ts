import { CorrelationId } from '@lib/decorators';
import { XsighubLoggerService } from '@lib/logger';
import { ApiVersion } from '@lib/types';
import { Body, Controller, Delete, Get, Param, Patch, Post, Put } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import {
    SessionDocumentCreateDto,
    SessionDocumentDto,
    SessionDocumentMetadataLoadDto,
    SessionDocumentSignatureCreateDto,
    SessionDocumentUpdateDto,
} from '../dtos/session-document.dto';
import { SessionDocumentService } from '../services/session-document.service';

@Controller({
    path: 'session-documents',
    version: ApiVersion.V1,
})
@ApiTags(SessionDocumentController.name)
@ApiBearerAuth()
export class SessionDocumentController {
    constructor(
        private readonly _logger: XsighubLoggerService,
        private readonly _sessionDocumentService: SessionDocumentService,
    ) {
        this._logger.setContext(this.constructor.name);
    }

    @Post()
    create(
        @CorrelationId() correlationId: string,
        @Body() data: SessionDocumentCreateDto,
    ): Promise<SessionDocumentDto> {
        this._logger.info(`[${this.create.name}]`, { correlationId });

        return this._sessionDocumentService.create(data, { correlationId });
    }

    @Get(':documentId')
    findById(
        @CorrelationId() correlationId: string,
        @Param('documentId') documentId: number,
    ): Promise<SessionDocumentDto> {
        this._logger.info(`[${this.findById.name}]`, { correlationId });

        return this._sessionDocumentService.findById(documentId, { correlationId });
    }

    @Put(':signatureId')
    update(
        @CorrelationId() correlationId: string,
        @Param('signatureId') signatureId: number,
        @Body() data: SessionDocumentUpdateDto,
    ): Promise<SessionDocumentDto> {
        this._logger.info(`[${this.delete.name}]`, { correlationId });

        return this._sessionDocumentService.update(signatureId, data, { correlationId });
    }

    @Patch(':documentId/signatures/attach')
    attachSignature(
        @CorrelationId() correlationId: string,
        @Param('documentId') documentId: number,
        @Body() data: SessionDocumentSignatureCreateDto,
    ): Promise<SessionDocumentDto> {
        this._logger.info(`[${this.delete.name}]`, { correlationId });

        return this._sessionDocumentService.attachSignature(documentId, data, { correlationId });
    }

    @Patch(':documentId/metadata/load')
    loadMetadata(
        @CorrelationId() correlationId: string,
        @Param('documentId') documentId: number,
        @Body() data: SessionDocumentMetadataLoadDto,
    ): Promise<SessionDocumentDto> {
        this._logger.info(`[${this.loadMetadata.name}]`, { correlationId });

        return this._sessionDocumentService.loadMetadata(documentId, data, { correlationId });
    }

    @Delete(':signatureId')
    delete(
        @CorrelationId() correlationId: string,
        @Param('signatureId') signatureId: number,
    ): Promise<SessionDocumentDto> {
        this._logger.info(`[${this.delete.name}]`, { correlationId });

        return this._sessionDocumentService.delete(signatureId, { correlationId });
    }
}
