import { Module } from '@nestjs/common';
import { SessionDocumentController } from './controllers/session-document.controller';
import { SessionReferenceController } from './controllers/session-reference.controller';
import { SessionSignatureController } from './controllers/session-signature.controller';
import { SessionController } from './controllers/session.controller';
import { SessionGateway } from './gateways/session.gateway';
import { SessionDocumentService } from './services/session-document.service';
import { SessionReferenceService } from './services/session-reference.service';
import { SessionSignatureService } from './services/session-signature.service';
import { SessionService } from './services/session.service';

const CONTROLLERS = [
    SessionController,
    SessionReferenceController,
    SessionSignatureController,
    SessionDocumentController,
];

const SERVICES = [
    SessionService,
    SessionReferenceService,
    SessionSignatureService,
    SessionDocumentService,
];

const GATEWAYS = [SessionGateway];

@Module({
    controllers: CONTROLLERS,
    providers: [...SERVICES, ...GATEWAYS],
    exports: SERVICES,
})
export class SessionModule {}
