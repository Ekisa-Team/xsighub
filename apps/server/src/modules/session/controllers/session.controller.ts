import { ClientIp, CorrelationId, UserAgent } from '@lib/decorators';
import { XsighubLoggerService } from '@lib/logger';
import { ApiVersion } from '@lib/types';
import { Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { SessionDto } from '../dtos/session.dto';
import { SessionService } from '../services/session.service';

@Controller({
    path: 'sessions',
    version: ApiVersion.V1,
})
@ApiTags(SessionController.name)
@ApiBearerAuth()
export class SessionController {
    constructor(
        private readonly _logger: XsighubLoggerService,
        private readonly _sessionsService: SessionService,
    ) {
        this._logger.setContext(this.constructor.name);
    }

    @Post()
    create(
        @CorrelationId() correlationId: string,
        @ClientIp() clientIp: string,
        @UserAgent() userAgent: UAParser.IResult,
    ): Promise<SessionDto> {
        this._logger.info(`[${this.create.name}]`, { correlationId });

        return this._sessionsService.create(clientIp, userAgent.ua, { correlationId });
    }

    @Get()
    findByIpAddress(@CorrelationId() correlationId: string, @ClientIp() clientIp: string): Promise<SessionDto> {
        this._logger.info(`[${this.findByIpAddress.name}]`, { correlationId });

        return this._sessionsService.findByIpAddress(clientIp, { correlationId });
    }

    @Get(':pairingKey')
    findByPairingKey(
        @CorrelationId() correlationId: string,
        @Param('pairingKey') pairingKey: string,
    ): Promise<SessionDto> {
        this._logger.info(`[${this.findByPairingKey.name}]`, { correlationId });

        return this._sessionsService.findByPairingKey(pairingKey, { correlationId });
    }

    @Patch(':pairingKey/pair')
    pair(@CorrelationId() correlationId: string, @Param('pairingKey') pairingKey: string): Promise<SessionDto> {
        this._logger.info(`[${this.pair.name}]`, { correlationId });

        return this._sessionsService.pair(pairingKey, { correlationId });
    }

    @Patch(':pairingKey/unpair')
    unpair(@CorrelationId() correlationId: string, @Param('pairingKey') pairingKey: string): Promise<SessionDto> {
        this._logger.info(`[${this.unpair.name}]`, { correlationId });

        return this._sessionsService.unpair(pairingKey, { correlationId });
    }

    @Delete(':pairingKey')
    destroy(@CorrelationId() correlationId: string, @Param('pairingKey') pairingKey: string): Promise<SessionDto> {
        this._logger.info(`[${this.destroy.name}]`, { correlationId });

        return this._sessionsService.destroy(pairingKey, { correlationId });
    }
}
