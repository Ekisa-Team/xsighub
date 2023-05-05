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
import { FormsModule } from '@angular/forms';
import { client, environmentPlugin, type SdkClient } from '@ekisa-xsighub/sdk';
import { Subject, distinctUntilChanged, switchMap, takeUntil, tap, timer } from 'rxjs';

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

export const LONG_POLLING_INTERVAL = 3000;

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './app.component.html',
})
export class AppComponent implements OnInit, OnDestroy {
    @ViewChild('qrContainer') qrContainer!: ElementRef<HTMLDivElement>;

    renderer = inject(Renderer2);

    stopLongPolling$!: Subject<void>;

    sdkClient!: SdkClient;

    selectedUser = '';

    get session(): Session | null {
        try {
            const storedSession = localStorage.getItem('xsighub:session');
            return storedSession ? JSON.parse(storedSession) : null;
        } catch (error) {
            console.error(`Error parsing session from localStorage: ${error}`);
            return null;
        }
    }

    set session(value: Session | null) {
        if (value) {
            localStorage.setItem('xsighub:session', JSON.stringify(value));
        } else {
            localStorage.removeItem('xsighub:session');
        }
    }

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

        this.session && this.retrieveSession();
    }

    ngOnDestroy(): void {
        this._stopLongPolling();
    }

    async createSession(): Promise<void> {
        const response = await this.sdkClient.sessions.create();

        this.session = await response.json();

        await this.retrieveSession();
    }

    async retrieveSession(): Promise<void> {
        if (!this.session) return;

        this.stopLongPolling$ = new Subject<void>();

        timer(0, LONG_POLLING_INTERVAL)
            .pipe(
                takeUntil(this.stopLongPolling$),
                switchMap(() => this.sdkClient.sessions.retrieve(this.session?.pairingKey ?? '')),
                switchMap((response) => response.json()),
                distinctUntilChanged((prevSession: Session, currSession: Session) => {
                    return JSON.stringify(prevSession) === JSON.stringify(currSession);
                }),
                tap(async (session: Session) => {
                    console.log(session);
                    this.session = session;

                    if (!this.qrContainer?.nativeElement.hasChildNodes()) {
                        await this.generateQR();
                    }

                    if (this.session?.data.signature) {
                        // Lógica para almacenar firma en la base de datos
                    }
                }),
            )
            .subscribe();
    }

    async generateQR(): Promise<void> {
        if (!this.session) return;

        const qrCode = await this.sdkClient.sessions.generateQR(this.session.pairingKey);

        this.renderer.appendChild(
            this.qrContainer?.nativeElement,
            new DOMParser().parseFromString(qrCode, 'text/html').body.firstElementChild,
        );
    }

    async destroySession(): Promise<void> {
        if (!this.session) return;

        await this.sdkClient.sessions.destroy(this.session.pairingKey);

        this.session = null;

        this._stopLongPolling();
    }

    async handleUserSelection(name: string): Promise<void> {
        this.selectedUser = name;

        this.createSession();
    }

    private _stopLongPolling(): void {
        this.stopLongPolling$.next();
        this.stopLongPolling$.unsubscribe();
    }
}
