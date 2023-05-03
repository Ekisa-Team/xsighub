import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import SignaturePad from 'signature_pad';

@Component({
    selector: 'app-tab3',
    templateUrl: 'tab3.page.html',
    styleUrls: ['tab3.page.scss'],
})
export class Tab3Page implements AfterViewInit {
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
