import { CorrelationId } from '@lib/decorators';
import { XsighubLoggerService } from '@lib/logger';
import { ApiVersion } from '@lib/types';
import { Body, Controller, Delete, Param, Post, Put } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import {
    SessionReferenceCreateDto,
    SessionReferenceDto,
    SessionReferenceUpdateDto,
} from '../dtos/session-reference.dto';
import { SessionReferenceService } from '../services/session-reference.service';

@Controller({
    path: 'session-references',
    version: ApiVersion.V1,
})
@ApiTags(SessionReferenceController.name)
@ApiBearerAuth()
export class SessionReferenceController {
    constructor(
        private readonly _logger: XsighubLoggerService,
        private readonly _sessionReferenceService: SessionReferenceService,
    ) {
        this._logger.setContext(this.constructor.name);
    }

    @Post()
    create(
        @CorrelationId() correlationId: string,
        @Body() data: SessionReferenceCreateDto,
    ): Promise<SessionReferenceDto> {
        this._logger.info(`[${this.create.name}]`, { correlationId });

        return this._sessionReferenceService.create(data, { correlationId });
    }

    @Put(':referenceId')
    update(
        @CorrelationId() correlationId: string,
        @Param('referenceId') referenceId: number,
        @Body() data: SessionReferenceUpdateDto,
    ): Promise<SessionReferenceDto> {
        this._logger.info(`[${this.delete.name}]`, { correlationId });

        return this._sessionReferenceService.update(referenceId, data, { correlationId });
    }

    @Delete(':referenceId')
    delete(
        @CorrelationId() correlationId: string,
        @Param('referenceId') referenceId: number,
    ): Promise<SessionReferenceDto> {
        this._logger.info(`[${this.delete.name}]`, { correlationId });

        return this._sessionReferenceService.delete(referenceId, { correlationId });
    }
}
