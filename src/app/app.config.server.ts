import { ApplicationConfig, mergeApplicationConfig } from '@angular/core';
import { provideServerRendering, withRoutes } from '@angular/ssr';
import { appConfig } from './app.config';
import { serverRoutes } from './app.routes.server';
import { DOMPURIFY_TOKEN } from './providers/dompurify-token';
import { getDomPurifyServerInstance } from './providers/server-sanitizer.factory';

const serverProviders = [
  provideServerRendering(withRoutes(serverRoutes)),
  { provide: DOMPURIFY_TOKEN, useFactory: getDomPurifyServerInstance },
];

export const config: ApplicationConfig = mergeApplicationConfig(appConfig, { 
  providers: serverProviders 
});