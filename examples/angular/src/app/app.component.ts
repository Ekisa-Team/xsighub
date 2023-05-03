import { CommonModule } from '@angular/common';
import {
    Component,
    ElementRef,
    OnDestroy,
    OnInit,
    Renderer2,
    ViewChild,
    inject,
} from '@angular/core';
import { client, environmentPlugin, type SdkClient } from '@ekisa-xsighub/sdk';
import { Subject, takeUntil, timer } from 'rxjs';

export const LONG_POLLING_INTERVAL = 3000;

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './app.component.html',
})
export class AppComponent implements OnInit, OnDestroy {
    @ViewChild('qrContainer') qrContainer!: ElementRef<HTMLDivElement>;

    renderer = inject(Renderer2);

    stopLongPolling$!: Subject<void>;

    sdkClient!: SdkClient;

    session: any;

    async ngOnInit(): Promise<void> {
        this.sdkClient = await client.init('my-secret', {
            plugins: [
                environmentPlugin({
                    having: {
                        development: 'http://localhost:3000',
                        staging: 'http://localhost:3001',
                        production: 'http://localhost:3002',
                    },
                    use: 'development',
                }),
            ],
        });

        this.createSession();
    }

    ngOnDestroy(): void {
        this._stopLongPolling();
    }

    async createSession(): Promise<void> {
        const response = await this.sdkClient.sessions.create();
        const session = await response.json();

        await this.retrieveSession(session.pairingKey);
    }

    async retrieveSession(pairingKey: string): Promise<void> {
        this.stopLongPolling$ = new Subject<void>();

        timer(0, LONG_POLLING_INTERVAL)
            .pipe(takeUntil(this.stopLongPolling$))
            .subscribe(async (count) => {
                const response = await this.sdkClient.sessions.retrieve(pairingKey);
                const session = await response.json();

                this.session = session;

                count === 0 && (await this.generateQR(pairingKey));
            });
    }

    async generateQR(pairingKey: string): Promise<void> {
        const qrCode = await this.sdkClient.sessions.generateQR(pairingKey);

        this.renderer.appendChild(
            this.qrContainer?.nativeElement,
            new DOMParser().parseFromString(qrCode, 'text/html').body.firstElementChild,
        );
    }

    async destroySession(): Promise<void> {
        const response = await this.sdkClient.sessions.destroy(this.session?.pairingKey);
        const session = await response.json();

        if (session) {
            this.session = null;
            this._stopLongPolling();
        }
    }

    private _stopLongPolling(): void {
        this.stopLongPolling$.next();
        this.stopLongPolling$.unsubscribe();
    }
}
