import { FastifyPluginAsync, FastifyRequest } from 'fastify';
import { getClientIp } from 'request-ip';
import { generateKey } from '../../helpers/codegen';

export enum SessionEndpoints {
    getSessions = '/sessions',
    createSession = '/sessions',
    pairSession = '/sessions/:pairingKey/connections',
    updateSession = '/sessions/:pairingKey/data',
    destroySession = '/sessions/:pairingKey',
}

export type Session = {
    pairingKey: string;
    connection: SessionConnection;
    data: SessionData;
};

export type SessionConnection = {
    clientIp: string;
    userAgent: string;
    isPaired: boolean;
    pairedAt?: Date;
};

export type SessionData = {
    signature: string;
};

const activeSessions = new Map<string, Session>();

export const sessions: FastifyPluginAsync = async (fastify): Promise<void> => {
    fastify.get(SessionEndpoints.getSessions, async (_request, reply) => {
        return reply.send({ sessions: Array.from(activeSessions) });
    });

    fastify.post(SessionEndpoints.createSession, async (request, reply) => {
        const pairingKey = generateKey(6).toString();

        const session: Session = {
            pairingKey,
            connection: {
                clientIp: getClientIp(request) ?? '0.0.0.0',
                userAgent: request.headers['user-agent'] || '',
                isPaired: false,
            },
            data: {
                signature: '',
            },
        };

        activeSessions.set(pairingKey, session);

        return reply.status(201).send({ created: session });
    });

    fastify.patch(SessionEndpoints.pairSession, async (request, reply) => {
        const { pairingKey } = request.params as FastifyRequest<{
            Params: { pairingKey: string };
        }>['params'];

        const sessionToUpdate = activeSessions.get(pairingKey);

        if (!sessionToUpdate) {
            return reply
                .status(404)
                .send({ message: `Session with the pairing key ${pairingKey} wasn't found.` });
        }

        const updatedSession: Session = {
            ...sessionToUpdate,
            connection: {
                ...sessionToUpdate.connection,
                isPaired: true,
                pairedAt: new Date(),
            },
        };

        activeSessions.set(pairingKey, updatedSession);

        return reply.send({ paired: updatedSession });
    });

    fastify.patch(SessionEndpoints.updateSession, async (request, reply) => {
        const { pairingKey } = request.params as FastifyRequest<{
            Params: { pairingKey: string };
        }>['params'];

        const data = request.body as FastifyRequest<{
            Body: SessionData;
        }>['body'];

        const sessionToUpdate = activeSessions.get(pairingKey);

        if (!sessionToUpdate) {
            return reply
                .status(404)
                .send({ message: `Session with the pairing key ${pairingKey} wasn't found.` });
        }

        if (!sessionToUpdate.connection.isPaired) {
            return reply.status(400).send({
                message: `Devices are not paired yet. Make sure to pair them before proceeding further.`,
            });
        }

        const updatedSession: Session = {
            ...sessionToUpdate,
            data,
        };

        activeSessions.set(pairingKey, updatedSession);

        return reply.send({ updated: updatedSession });
    });

    fastify.delete(SessionEndpoints.destroySession, async (request, reply) => {
        const { pairingKey } = request.params as FastifyRequest<{
            Params: { pairingKey: string };
        }>['params'];

        const sessionToDelete = activeSessions.get(pairingKey);

        if (!sessionToDelete) {
            return reply
                .status(404)
                .send({ message: `Session with the pairing key ${pairingKey} wasn't found.` });
        }

        activeSessions.delete(pairingKey);

        return reply.send({ deleted: sessionToDelete });
    });
};
