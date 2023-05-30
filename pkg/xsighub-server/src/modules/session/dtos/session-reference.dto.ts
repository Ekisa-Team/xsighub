import { PartialType, PickType } from '@nestjs/swagger';
import { SessionReference } from '@prisma/client';
import { Expose } from 'class-transformer';
import {
    IsEnum,
    IsInt,
    IsNotEmpty,
    IsPositive,
    IsString,
    MaxLength,
    ValidateIf,
} from 'class-validator';
import { SessionReferenceType } from '../enums/session-reference.enum';
import { SessionDto } from './session.dto';

export class SessionReferenceDto implements SessionReference {
    @Expose({ toClassOnly: true })
    @IsNotEmpty()
    id: number;

    @IsNotEmpty()
    @IsEnum(SessionReferenceType)
    type: string;

    @IsNotEmpty()
    @IsString()
    @MaxLength(40)
    name: string;

    @ValidateIf((o) => o.type === SessionReferenceType.Document)
    @IsNotEmpty()
    @IsString()
    documentPlaceholder: string;

    @IsInt()
    @IsPositive()
    sessionId: SessionDto['id'];
}

export class SessionReferenceCreateDto extends PickType(SessionReferenceDto, [
    'type',
    'name',
    'documentPlaceholder',
    'sessionId',
] as const) {}

export class SessionReferenceUpdateDto extends PartialType(SessionReferenceCreateDto) {}
