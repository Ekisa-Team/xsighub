import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import SignaturePad from 'signature_pad';

@Component({
    selector: 'app-signature',
    standalone: true,
    imports: [IonicModule, CommonModule, FormsModule],
    templateUrl: 'signature.page.html',
    styleUrls: ['signature.page.scss'],
})
export class SignaturePage implements AfterViewInit {
    @ViewChild('canvas') canvasRef!: ElementRef;

    signaturePad!: SignaturePad;

    signatureImg!: string;

    ngAfterViewInit() {
        this.signaturePad = new SignaturePad(this.canvasRef.nativeElement, {
            backgroundColor: 'white',
        });
    }

    save() {
        const base64Data = this.signaturePad.toDataURL();
        this.signatureImg = base64Data;
    }

    undo() {
        const data = this.signaturePad.toData();

        if (data) {
            data.pop();
            this.signaturePad.fromData(data);
        }
    }

    clear() {
        this.signaturePad.clear();
    }
}
