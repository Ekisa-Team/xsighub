export interface XsighubLogMethod {
    (message: string, obj?: unknown, ...args: unknown[]): void;
}
