import { PartialType, PickType } from '@nestjs/swagger';
import { SessionDocument } from '@prisma/client';
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

export class SessionDocumentDto implements SessionDocument {
    @Expose({ toClassOnly: true })
    @IsNotEmpty()
    id: number;

    @IsNotEmpty()
    @IsString()
    rawContent: string;

    @IsOptional()
    @IsString()
    metadata: string;

    @IsInt()
    @IsPositive()
    referenceId: SessionReferenceDto['id'];
}

export class SessionDocumentCreateDto extends PickType(SessionDocumentDto, [
    'rawContent',
    'referenceId',
] as const) {}

export class SessionDocumentUpdateDto extends PartialType(SessionDocumentCreateDto) {}

export class SessionDocumentSignatureCreateDto {
    @IsNotEmpty()
    @IsString()
    signatureName: string;

    @IsNotEmpty()
    @IsString()
    signatureData: string;
}

export class SessionDocumentMetadataLoadDto {
    @IsDefined()
    @IsNotEmptyObject()
    @IsObject()
    ingest: Record<string, string>;
}
