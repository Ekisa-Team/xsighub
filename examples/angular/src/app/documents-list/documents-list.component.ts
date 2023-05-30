import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, EventEmitter, Output, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { SessionDocument } from '@ekisa-xsighub/core';

@Component({
    selector: 'app-documents-list',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './documents-list.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DocumentsComponent {
    @Output() changed = new EventEmitter<SessionDocument[]>();

    http = inject(HttpClient);

    private readonly _doc1 = toSignal(
        this.http.get('/assets/docs/01-doc.md', {
            responseType: 'text',
        }),
    );

    private readonly _doc2 = toSignal(
        this.http.get('/assets/docs/02-doc.md', {
            responseType: 'text',
        }),
    );

    private readonly _doc3 = toSignal(
        this.http.get('/assets/docs/03-doc.md', {
            responseType: 'text',
        }),
    );

    private readonly _doc4 = toSignal(
        this.http.get('/assets/docs/04-doc.md', {
            responseType: 'text',
        }),
    );

    private readonly _doc5 = toSignal(
        this.http.get('/assets/docs/05-doc.md', {
            responseType: 'text',
        }),
    );

    get documents(): SessionDocument[] {
        return [
            {
                id: 'doc1',
                title: 'Consentimientos informados',
                content: this._doc1() ?? '',
            },
            {
                id: 'doc2',
                title: 'Ejercicios de terapia física',
                content: this._doc2() ?? '',
            },
            {
                id: 'doc3',
                title: 'Historial médico',
                content: this._doc3() ?? '',
            },
            {
                id: 'doc4',
                title: 'Instrucciones de la receta',
                content: this._doc4() ?? '',
            },
            {
                id: 'doc5',
                title: 'Resultados de exámenes de laboratorio',
                content: this._doc5() ?? '',
            },
        ];
    }

    selectedDocuments: SessionDocument[] = [];

    handleModelChange(ids: string[]): void {
        this.selectedDocuments = this.documents.filter((document) =>
            ids.find((id) => document.id === id),
        );

        this.changed.emit(this.selectedDocuments);
    }
}
