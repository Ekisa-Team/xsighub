import { SessionConnection } from '@prisma/client';
import { SessionDto } from './session.dto';

export class SessionConnectionDto implements SessionConnection {
    id: number;
    clientIp: string;
    userAgent: string;
    isPaired: boolean;
    pairedAt: Date;
    sessionId: SessionDto['id'];
}
