import { BaseDtoWithTimestamps } from '@lib/dto';
import { Session } from '@prisma/client';
import { Expose } from 'class-transformer';
import { IsNotEmpty, IsNumber, MaxLength, MinLength } from 'class-validator';

export class SessionDto extends BaseDtoWithTimestamps<number> implements Session {
    @Expose({ toClassOnly: true })
    @IsNotEmpty()
    id: number;

    @Expose({ toClassOnly: true })
    @IsNotEmpty()
    @IsNumber()
    @MinLength(6)
    @MaxLength(6)
    pairingKey: string;
}
