import { Module } from '@nestjs/common';
import { SessionReferenceController } from './controllers/session-reference.controller';
import { SessionSignatureController } from './controllers/session-signature.controller';
import { SessionController } from './controllers/session.controller';
import { SessionGateway } from './gateways/session.gateway';
import { SessionReferenceService } from './services/session-reference.service';
import { SessionSignatureService } from './services/session-signature.service';
import { SessionService } from './services/session.service';

const CONTROLLERS = [SessionController, SessionReferenceController, SessionSignatureController];

const SERVICES = [SessionService, SessionReferenceService, SessionSignatureService];

const GATEWAYS = [SessionGateway];

@Module({
    controllers: CONTROLLERS,
    providers: [...SERVICES, ...GATEWAYS],
    exports: SERVICES,
})
export class SessionModule {}
