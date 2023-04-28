import { FastifyPluginAsync, FastifyRequest } from 'fastify';
import { randomUUID } from 'node:crypto';

export enum SessionEndpoints {
    getSessions = '/sessions',
    createSession = '/sessions',
    updateSession = '/sessions/:sessionId',
    deleteSession = '/sessions/:sessionId',
}

export type Session = {
    id: string;
    serverKey: string;
    mobileKey: string;
    data: SessionData;
};

export type SessionData = {
    signature: string;
};

const activeSessions = new Map<string, Session>();

export const sessions: FastifyPluginAsync = async (fastify): Promise<void> => {
    fastify.get(SessionEndpoints.getSessions, async (_request, reply) => {
        return reply.send({ sessions: Array.from(activeSessions) });
    });

    fastify.post(SessionEndpoints.createSession, async (_request, reply) => {
        const sessionId = randomUUID();

        const session: Session = {
            id: sessionId,
            serverKey: randomUUID(),
            mobileKey: randomUUID(),
            data: {
                signature: '',
            },
        };

        activeSessions.set(sessionId, session);

        return reply.status(201).send(session);
    });

    fastify.patch(SessionEndpoints.updateSession, async (request, reply) => {
        const { sessionId } = request.params as FastifyRequest<{
            Params: { sessionId: string };
        }>['params'];

        const data = request.body as FastifyRequest<{
            Body: SessionData;
        }>['body'];

        const sessionToUpdate = activeSessions.get(sessionId);

        if (!sessionToUpdate) {
            return reply.status(404).send({ message: `Session with ID ${sessionId} wasn't found` });
        }

        const updatedSession: Session = { ...sessionToUpdate, data };

        activeSessions.set(sessionId, updatedSession);

        return reply.send(updatedSession);
    });

    fastify.delete(SessionEndpoints.deleteSession, async (request, reply) => {
        const { sessionId } = request.params as FastifyRequest<{
            Params: { sessionId: string };
        }>['params'];

        const sessionToDelete = activeSessions.get(sessionId);

        if (!sessionToDelete) {
            return reply.status(404).send({ message: `Session with ID ${sessionId} wasn't found` });
        }

        activeSessions.delete(sessionId);

        return reply.send({ sessionId });
    });
};
