import QrCode from 'qrcode';

export interface SdkQr {
    generate(pairingKey: string): Promise<string>;
}

export class Qr implements SdkQr {
    async generate(pairingKey: string): Promise<string> {
        return new Promise((resolve, reject) => {
            QrCode.toString(pairingKey, (error, value) => {
                if (error) {
                    reject(error);
                }

                resolve(value);
            });
        });
    }
}
