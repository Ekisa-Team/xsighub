import { CommonModule } from '@angular/common';
import {
    Component,
    ElementRef,
    Input,
    Renderer2,
    ViewChild,
    WritableSignal,
    effect,
    inject,
} from '@angular/core';

@Component({
    selector: 'app-qr-view',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './qr-view.component.html',
})
export class QrViewComponent {
    @Input({ required: true }) code!: WritableSignal<string>;

    @ViewChild('qrWrapper') qrWrapper!: ElementRef<HTMLDivElement>;

    renderer = inject(Renderer2);

    constructor() {
        effect(async () => {
            if (this.code() && !this.qrWrapper?.nativeElement.hasChildNodes()) {
                const qrElement = new DOMParser().parseFromString(this.code(), 'text/html').body
                    .firstElementChild;

                this.renderer.appendChild(this.qrWrapper?.nativeElement, qrElement);
            }
        });
    }
}
