import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withFetch, withHttpTransferCache } from '@angular/common/http';

import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideClientHydration(withEventReplay()),
    // withHttpTransferCache: SSR serialises HTTP responses into the HTML payload;
    // the client reuses them on hydration instead of re-fetching from GCS,
    // preventing the flash of empty articles/content on first load.
    provideHttpClient(withFetch(), withHttpTransferCache()),
  ]
};
