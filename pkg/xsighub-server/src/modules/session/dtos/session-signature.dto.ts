import { PartialType, PickType } from '@nestjs/swagger';
import { SessionSignature } from '@prisma/client';
import { Expose } from 'class-transformer';
import { IsInt, IsNotEmpty, IsOptional, IsPositive, IsString } from 'class-validator';
import { SessionReferenceDto } from './session-reference.dto';

export class SessionSignatureDto implements SessionSignature {
    @Expose({ toClassOnly: true })
    @IsNotEmpty()
    id: number;

    @IsNotEmpty()
    @IsString()
    ingest: string;

    @IsOptional()
    @IsString()
    metadata: string;

    @IsInt()
    @IsPositive()
    referenceId: SessionReferenceDto['id'];
}

export class SessionSignatureCreateDto extends PickType(SessionSignatureDto, [
    'ingest',
    'metadata',
    'referenceId',
] as const) {}

export class SessionSignatureUpdateDto extends PartialType(SessionSignatureCreateDto) {}
