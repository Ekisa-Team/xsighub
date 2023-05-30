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
import { Session, SessionDocument } from '@ekisa-xsighub/core';
import { client, environmentPlugin, type SdkClient } from '@ekisa-xsighub/sdk';
import { Socket } from 'ngx-socket-io';
import { Subject, distinctUntilChanged, filter, switchMap, takeUntil, tap, timer } from 'rxjs';
import { DocumentsComponent } from './documents-list/documents-list.component';
import { ToolbarComponent } from './toolbar/toolbar.component';

export const LONG_POLLING_INTERVAL = 1000;

const COMPONENTS = [ToolbarComponent, DocumentsComponent] as const;

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [CommonModule, FormsModule, ...COMPONENTS],
    templateUrl: './app.component.html',
})
export class AppComponent implements OnInit, OnDestroy {
    @ViewChild('qrContainer') qrContainer!: ElementRef<HTMLDivElement>;

    stopLongPolling$!: Subject<void>;

    private readonly _socket = inject(Socket);

    renderer = inject(Renderer2);

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
    }

    ngOnDestroy(): void {
        this._stopLongPolling();
    }

    async createSession(): Promise<void> {
        // const response = await this.sdkClient.sessions.create();

        // this.session = await response.json();

        // await this.startSessionRetrieval();

        this._socket.emit('message', 'mundo');
    }

    async startSessionRetrieval(): Promise<void> {
        if (!this.session) return;

        this.stopLongPolling$ = new Subject<void>();

        timer(0, LONG_POLLING_INTERVAL)
            .pipe(
                switchMap(() => this.sdkClient.sessions.retrieve(this.session?.pairingKey ?? '')),
                tap((response) => {
                    if (response.status !== 200) {
                        this.session = null;
                        this._stopLongPolling();
                    }
                }),
                filter((response) => response.status === 200),
                switchMap((response) => response.json()),
                distinctUntilChanged<Session>(
                    (previous, current) => JSON.stringify(previous) === JSON.stringify(current),
                ),
                tap(async (session) => {
                    this.session = session;

                    this._handleQrGeneration();
                    this._handleSignatureIngest();
                }),
                takeUntil(this.stopLongPolling$),
            )
            .subscribe();
    }

    async destroySession(): Promise<void> {
        if (!this.session) return;

        await this.sdkClient.sessions.destroy(this.session.pairingKey);

        this.session = null;

        this._stopLongPolling();
    }

    async handleDocumentsChanged(documents: SessionDocument[]): Promise<void> {
        console.log(documents);
        if (!this.session) return;

        // await this.sdkClient.sessions.update(this.session.pairingKey, { sdf: '' });
    }

    async handleUserSelection(name: string): Promise<void> {
        this.selectedUser = name;

        this.createSession();
    }

    private async _handleQrGeneration(): Promise<void> {
        if (!this.session || this.qrContainer?.nativeElement.hasChildNodes()) return;

        const qrCode = await this.sdkClient.sessions.generateQR(this.session.pairingKey);

        this.renderer.appendChild(
            this.qrContainer?.nativeElement,
            new DOMParser().parseFromString(qrCode, 'text/html').body.firstElementChild,
        );
    }

    private async _handleSignatureIngest(): Promise<void> {
        if (this.session?.data?.payload) {
            console.log('Lógica para almacenar firma u otra información relacionada a la sesión.');
        }
    }

    private _stopLongPolling(): void {
        this.stopLongPolling$.next();
        this.stopLongPolling$.complete();
    }
}
