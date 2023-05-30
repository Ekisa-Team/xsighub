import { provideHttpClient } from '@angular/common/http';
import { importProvidersFrom } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { SocketIoModule } from 'ngx-socket-io';
import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent, {
    providers: [
        provideHttpClient(),
        importProvidersFrom([
            SocketIoModule.forRoot({
                url: 'ws://localhost:3000/sessions',
            }),
        ]),
    ],
}).catch((error) => console.error(error));
