import { ApplicationConfig, mergeApplicationConfig } from '@angular/core';
import { provideServerRendering, withRoutes } from '@angular/ssr'; // 👈 Import withRoutes
import { appConfig } from './app.config';
import { serverRoutes } from './app.routes.server'; // 👈 Import the new server routes

const serverProviders = [
  // Provide server rendering features, including the new server routes
  provideServerRendering(withRoutes(serverRoutes)), // 👈 Use withRoutes here
];

export const config: ApplicationConfig = mergeApplicationConfig(appConfig, { 
  providers: serverProviders 
});