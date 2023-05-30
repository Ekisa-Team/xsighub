import { XsighubLoggerService } from '@lib/logger';
import { PrismaService } from '@lib/prisma';
import { ApiExtras } from '@lib/types/api-extras';
import { Injectable, NotFoundException } from '@nestjs/common';
import {
    SessionSignatureCreateDto,
    SessionSignatureDto,
    SessionSignatureUpdateDto,
} from '../dtos/session-signature.dto';

@Injectable()
export class SessionSignatureService {
    constructor(
        private readonly _logger: XsighubLoggerService,
        private readonly _prisma: PrismaService,
    ) {
        this._logger.setContext(this.constructor.name);
    }

    async create(
        data: SessionSignatureCreateDto,
        { correlationId }: ApiExtras,
    ): Promise<SessionSignatureDto> {
        this._logger.info(`[${this.create.name}]`, { correlationId });

        const reference = await this._prisma.sessionReference.findUnique({
            where: {
                id: data.referenceId,
            },
        });

        if (!reference) {
            throw new NotFoundException(
                `The reference associated with the ID ${data.referenceId} could not be found.`,
            );
        }

        return this._prisma.sessionSignature.create({ data });
    }

    async update(
        signatureId: number,
        data: SessionSignatureUpdateDto,
        { correlationId }: ApiExtras,
    ): Promise<SessionSignatureDto> {
        this._logger.info(`[${this.update.name}]`, { correlationId });

        const signature = await this._prisma.sessionSignature.findUnique({
            where: {
                id: signatureId,
            },
        });

        if (!signature) {
            throw new NotFoundException(
                `The signature associated with the ID ${signatureId} could not be found.`,
            );
        }

        return this._prisma.sessionSignature.update({
            data,
            where: { id: signatureId },
        });
    }

    async delete(signatureId: number, { correlationId }: ApiExtras): Promise<SessionSignatureDto> {
        this._logger.info(`[${this.delete.name}]`, { correlationId });

        const signature = await this._prisma.sessionSignature.findUnique({
            where: {
                id: signatureId,
            },
        });

        if (!signature) {
            throw new NotFoundException(
                `The signature associated with the ID ${signatureId} could not be found.`,
            );
        }

        return this._prisma.sessionSignature.delete({
            where: {
                id: signatureId,
            },
        });
    }
}
