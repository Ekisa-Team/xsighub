import { PartialType, PickType } from '@nestjs/swagger';
import { SessionSignature } from '@prisma/client';
import { Expose } from 'class-transformer';
import {
    IsDefined,
    IsInt,
    IsNotEmpty,
    IsNotEmptyObject,
    IsObject,
    IsOptional,
    IsPositive,
    IsString,
} from 'class-validator';
import { SessionReferenceDto } from './session-reference.dto';

export class SessionSignatureDto implements SessionSignature {
    @Expose({ toClassOnly: true })
    @IsNotEmpty()
    id: number;

    @IsNotEmpty()
    @IsString()
    signatureData: string;

    @IsOptional()
    @IsString()
    metadata: string;

    @IsInt()
    @IsPositive()
    referenceId: SessionReferenceDto['id'];
}

export class SessionSignatureCreateDto extends PickType(SessionSignatureDto, [
    'signatureData',
    'referenceId',
] as const) {}

export class SessionSignatureUpdateDto extends PartialType(SessionSignatureCreateDto) {}

export class SessionSignatureMetadataLoadDto {
    @IsDefined()
    @IsNotEmptyObject()
    @IsObject()
    ingest: Record<string, string>;
}
