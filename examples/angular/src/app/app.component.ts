import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild, effect, inject, signal } from '@angular/core';
import {
    OpenReferenceRequest,
    Session,
    SessionDocument,
    SessionReference,
    SessionSignature,
    __serverEvents__,
    __webEvents__,
} from '@ekisa-xsighub/core';
import { randAvatar, randCountry, randEmail, randFullName, randRole } from '@ngneat/falso';
import { Socket } from 'ngx-socket-io';
import { map, tap } from 'rxjs';
import { ConnectionInfoComponent } from './connection-info/connection-info.component';
import { QrViewComponent } from './qr-view/qr-view.component';
import { ReferencesComponent } from './references/references.component';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { XsighubService } from './xsighub.service';

type SocketEvent = {
    message: string;
    session: Session;
    source?: 'session' | 'reference' | 'signature' | 'document';
    action?: 'create' | 'update' | 'delete';
    data?: Session | SessionReference | SessionSignature | SessionDocument;
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
    private readonly _xsighubService = inject(XsighubService);

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
        this._xsighubService.client.sessions
            .findByIpAddress()
            .then((session) => this.session.set(session))
            .catch(console.warn);

        this._setupSocketEvents();
    }

    createSession = () => this._xsighubService.client.sessions.create().catch(alert);

    destroySession = () => this._xsighubService.client.sessions.destroy().catch(alert);

    createReference(reference: SessionReference): void {
        this._xsighubService.client.references.create({
            type: reference.type,
            name: reference.name,
            documentPlaceholder: reference.documentPlaceholder,
            sessionId: reference.sessionId,
        });
    }

    deleteReference(referenceId: number): void {
        if (
            confirm(
                'Si se elimina una referencia, se pierden todas las firmas y documentos asociados. ¿Desea continuar?',
            )
        ) {
            this._xsighubService.client.references.delete(referenceId);
        }
    }

    openReference(request: OpenReferenceRequest): void {
        this._socket.emit(__webEvents__.openReference, request);
    }

    private _setupSocketEvents(): void {
        [
            __serverEvents__.sessionCreated,
            __serverEvents__.sessionPaired,
            __serverEvents__.sessionUnpaired,
        ].forEach((event) =>
            this._socket
                .fromEvent<SocketEvent>(event)
                .pipe(
                    tap(({ session, message }) => console.log(message, { session })),
                    map(({ session }) => session),
                )
                .subscribe(this.session.set),
        );

        this._socket
            .fromEvent<SocketEvent>(__serverEvents__.sessionUpdated)
            .pipe(tap(({ message }) => console.log(message)))
            .subscribe(({ session, source, action, data }) => {
                this.session.set(session);

                if (source === 'document' && action === 'create' && data) {
                    this._xsighubService.client.documents.loadMetadata(data.id, {
                        ingest: {
                            paciente: randFullName(),
                            pacienteAvatar: randAvatar(),
                            pacientePais: randCountry(),
                            acudiente: randFullName({ gender: 'female' }),
                            acudienteAvatar: randAvatar(),
                            acudienteEmail: randEmail(),
                            medico: randFullName(),
                            medicoAvatar: randAvatar(),
                            medicoRol: randRole(),
                        },
                    });
                }
            });

        this._socket
            .fromEvent<SocketEvent>(__serverEvents__.sessionDestroyed)
            .pipe(tap(({ message }) => console.log(message)))
            .subscribe(() => this.session.set(null));

        this._socket
            .fromEvent<SocketEvent>(__serverEvents__.referenceOpenedRequested)
            .pipe(tap(console.log))
            .subscribe();
    }
}
