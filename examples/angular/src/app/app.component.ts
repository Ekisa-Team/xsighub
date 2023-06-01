import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild, effect, inject, signal } from '@angular/core';
import { Session, SessionReference, __sessionSocketEvents__ } from '@ekisa-xsighub/core';
import { client } from '@ekisa-xsighub/sdk';
import { Socket } from 'ngx-socket-io';
import { map } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { ConnectionInfoComponent } from './connection-info/connection-info.component';
import { QrViewComponent } from './qr-view/qr-view.component';
import { ReferencesComponent } from './references/references.component';
import { ToolbarComponent } from './toolbar/toolbar.component';

type SocketEvent = {
    message: string;
    session: Session;
};

const COMPONENTS = [
    ToolbarComponent,
    QrViewComponent,
    ReferencesComponent,
    ConnectionInfoComponent,
] as const;

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [CommonModule, ...COMPONENTS],
    templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
    @ViewChild('qrContainer') qrContainer!: ElementRef<HTMLDivElement>;

    private readonly _socket = inject(Socket);

    private readonly _sdk = client.init({
        host: environment.xsighub.host,
        version: 'v=1.0',
    });

    pairingKey = signal<string | null>(null);

    session = signal<Session | null>(null);

    constructor() {
        effect(
            () => {
                const session = this.session();

                session ? this.pairingKey.set(session.pairingKey) : this.pairingKey.set(null);
            },
            {
                allowSignalWrites: true,
            },
        );
    }

    ngOnInit(): void {
        this._sdk.sessions
            .findByIpAddress()
            .then((session) => this.session.set(session))
            .catch(console.warn);

        this._setupSocketEvents();
    }

    createSession = () => this._sdk.sessions.create().catch(alert);

    destroySession = () => this._sdk.sessions.destroy().catch(alert);

    handleCreateStandalone(reference: SessionReference): void {
        this._sdk.references.create({
            type: reference.type,
            name: reference.name,
            documentPlaceholder: reference.documentPlaceholder,
            sessionId: reference.sessionId,
        });
    }

    handleDeleteStandalone(referenceId: number): void {
        if (
            confirm(
                'Si se elimina una referencia, se pierden todas las firmas asociadas. ¿Desea continuar?',
            )
        ) {
            this._sdk.references.delete(referenceId);
        }
    }

    private _setupSocketEvents(): void {
        this._socket
            .fromEvent<SocketEvent>(__sessionSocketEvents__.created)
            .pipe(map((event) => event.session))
            .subscribe(this.session.set);

        this._socket
            .fromEvent<SocketEvent>(__sessionSocketEvents__.updated)
            .pipe(map((event) => event.session))
            .subscribe(this.session.set);

        this._socket
            .fromEvent<SocketEvent>(__sessionSocketEvents__.paired)
            .pipe(map((event) => event.session))
            .subscribe(this.session.set);

        this._socket
            .fromEvent<SocketEvent>(__sessionSocketEvents__.destroyed)
            .subscribe(() => this.session.set(null));
    }
}
