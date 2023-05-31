export type SocketEvent<EventName extends string> = {
    [key in EventName]: string;
};
