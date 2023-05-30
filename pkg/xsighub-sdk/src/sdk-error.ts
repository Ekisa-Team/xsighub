export class SdkError extends Error {
    constructor(message = '', options?: ErrorOptions | undefined) {
        super(message, options);

        this.name = this.constructor.name;
    }
}
