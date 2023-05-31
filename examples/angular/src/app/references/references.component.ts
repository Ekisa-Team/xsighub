import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Session, SessionReference, SessionSignature } from '@ekisa-xsighub/core';
import { DOC_1 } from './docs/doc1';
import { DOC_2 } from './docs/doc2';
import { DOC_3 } from './docs/doc3';
import { DOC_4 } from './docs/doc4';
import { DOC_5 } from './docs/doc5';

@Component({
    selector: 'app-references',
    standalone: true,
    imports: [CommonModule, FormsModule, ReactiveFormsModule],
    templateUrl: './references.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReferencesComponent {
    @Input({ required: true }) session!: Session;

    @Output() createReference = new EventEmitter<SessionReference>();
    @Output() deleteReference = new EventEmitter<SessionReference['id']>();

    get standaloneReference(): SessionReference | undefined {
        return this.session?.references?.find((ref) => ref.type === 'standalone');
    }

    get documentReferences(): SessionReference[] {
        return this.session?.references?.filter((ref) => ref.type === 'document') ?? [];
    }

    get templates(): SessionReference[] {
        const generatedTemplates: SessionReference[] = [];

        const templatesNames: Record<string, string> = {
            doc1: 'Consentimientos informados',
            doc2: 'Ejercicios de terapia física',
            doc3: 'Historial médico',
            doc4: 'Instrucciones de la receta',
            doc5: 'Resultados de exámenes de laboratorio',
        };

        const placeholders: Record<string, string> = {
            doc1: DOC_1,
            doc2: DOC_2,
            doc3: DOC_3,
            doc4: DOC_4,
            doc5: DOC_5,
        };

        for (const key of Object.keys(templatesNames)) {
            generatedTemplates.push({
                id: this._findReferenceId(templatesNames[key]),
                type: 'document',
                name: templatesNames[key],
                documentPlaceholder: placeholders[key],
                signatures: this._findReferenceSignatures(templatesNames[key]),
                sessionId: this.session.id,
            });
        }

        return generatedTemplates;
    }

    handleReferenceCreation(reference?: SessionReference): void {
        let newReference: SessionReference = {
            id: 0,
            type: 'standalone',
            name: 'Standalone Ref',
            sessionId: this.session.id,
        };

        if (reference) {
            newReference = structuredClone(reference);
        }

        this.createReference.emit(newReference);
    }

    handleReferenceDeletion(referenceId: SessionReference['id']): void {
        this.deleteReference.emit(referenceId);
    }

    private _findReferenceId(name: string): number {
        return this.session.references?.find((ref) => ref.name === name)?.id ?? 0;
    }

    private _findReferenceSignatures(name: string): SessionSignature[] {
        return this.session.references?.find((ref) => ref.name === name)?.signatures ?? [];
    }
}
