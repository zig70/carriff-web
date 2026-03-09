import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
import express from 'express';
import { join } from 'node:path';
import compression from 'compression';
import helmet from 'helmet';

const browserDistFolder = join(import.meta.dirname, '../browser');

const app = express();
const angularApp = new AngularNodeAppEngine();

app.use(compression());

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        // Helmet defaults script-src-attr to 'none', which blocks Angular's
        // event replay inline event handlers and prevents the app initialising.
        // Match scriptSrc so Angular hydration/event-replay works correctly.
        scriptSrcAttr: ["'unsafe-inline'"],
        styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
        imgSrc: ["'self'", 'data:', 'https://storage.googleapis.com'],
        frameSrc: ['https://open.spotify.com'],
        connectSrc: ["'self'", 'https://storage.googleapis.com'],
        fontSrc: ["'self'", 'https://fonts.gstatic.com'],
      },
    },
    // Required: Spotify iframes set cross-origin headers that COEP blocks
    crossOriginEmbedderPolicy: false,
  }),
);

app.use((req, res, next) => {
  // Check if the request is HTTP (GCP usually passes this in x-forwarded-proto)
  const proto = req.headers['x-forwarded-proto'];
  if (proto === 'http') {
    // Force a 301 Permanent Redirect to HTTPS
    return res.redirect(301, `https://${req.headers.host}${req.url}`);
  }
  next();
});

app.use(
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: false,
    redirect: false,
  }),
);


app.use((req, res, next) => {
  angularApp
    .handle(req)
    .then((response) =>
      response ? writeResponseToNodeResponse(response, res) : next(),
    )
    .catch(next);
});


if (isMainModule(import.meta.url) || process.env['pm_id']) {
  const port = process.env['PORT'] || 8080;
  app.listen(port, (error) => {
    if (error) {
      throw error;
    }

    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

export const reqHandler = createNodeRequestHandler(app);
