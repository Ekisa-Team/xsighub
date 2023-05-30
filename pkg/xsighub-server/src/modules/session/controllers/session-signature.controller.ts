import { CorrelationId } from '@lib/decorators';
import { XsighubLoggerService } from '@lib/logger';
import { ApiVersion } from '@lib/types';
import { Body, Controller, Delete, Param, Post, Put } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import {
    SessionSignatureCreateDto,
    SessionSignatureDto,
    SessionSignatureUpdateDto,
} from '../dtos/session-signature.dto';
import { SessionSignatureService } from '../services/session-signature.service';

@Controller({
    path: 'session-signatures',
    version: ApiVersion.V1,
})
@ApiTags(SessionSignatureController.name)
@ApiBearerAuth()
export class SessionSignatureController {
    constructor(
        private readonly _logger: XsighubLoggerService,
        private readonly _sessionSignatureService: SessionSignatureService,
    ) {
        this._logger.setContext(this.constructor.name);
    }

    @Post()
    create(
        @CorrelationId() correlationId: string,
        @Body() data: SessionSignatureCreateDto,
    ): Promise<SessionSignatureDto> {
        this._logger.info(`[${this.create.name}]`, { correlationId });

        return this._sessionSignatureService.create(data, { correlationId });
    }

    @Put(':signatureId')
    update(
        @CorrelationId() correlationId: string,
        @Param('signatureId') signatureId: number,
        @Body() data: SessionSignatureUpdateDto,
    ): Promise<SessionSignatureDto> {
        this._logger.info(`[${this.delete.name}]`, { correlationId });

        return this._sessionSignatureService.update(signatureId, data, { correlationId });
    }

    @Delete(':signatureId')
    delete(
        @CorrelationId() correlationId: string,
        @Param('signatureId') signatureId: number,
    ): Promise<SessionSignatureDto> {
        this._logger.info(`[${this.delete.name}]`, { correlationId });

        return this._sessionSignatureService.delete(signatureId, { correlationId });
    }
}
