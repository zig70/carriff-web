import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withFetch } from '@angular/common/http';

import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    // provideClientHydration enables HTTP transfer cache by default (Angular 17+):
    // SSR/prerender serialises HttpClient responses into the HTML transfer state;
    // the client reuses them on hydration instead of re-fetching from GCS,
    // preventing the flash of empty articles/content on first load.
    provideClientHydration(withEventReplay()),
    provideHttpClient(withFetch()),
  ]
};
