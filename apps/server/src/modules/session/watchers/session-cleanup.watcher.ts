import { XsighubLoggerService } from '@lib/logger';
import { Injectable } from '@nestjs/common';
import ms from 'ms';
import { Subject, interval, startWith, takeUntil } from 'rxjs';
import { SessionService } from '../services/session.service';

const INTERVAL = ms('1d');

@Injectable()
export class SessionCleanupWatcher {
    private readonly stop$ = new Subject<void>();

    constructor(
        private readonly _logger: XsighubLoggerService,
        private readonly _sessionService: SessionService,
    ) {
        this._logger.setContext(this.constructor.name);
    }

    async start(): Promise<void> {
        this._logger.info(`Session cleanup watcher started`);

        interval(INTERVAL)
            .pipe(startWith(0), takeUntil(this.stop$))
            .subscribe(async () => {
                try {
                    const { cleanedUp } = await this._sessionService.cleanup();

                    this._logger.info(
                        `A total of ${cleanedUp.length} sessions were destroyed${
                            cleanedUp.length ? ' (' + cleanedUp.map((r) => r.pairingKey).join(', ') + ').' : '.'
                        }`,
                    );
                } catch (error) {
                    this._logger.error(JSON.stringify(error));
                }
            });
    }

    async stop(): Promise<void> {
        this.stop$.next();
        this.stop$.complete();
    }
}
