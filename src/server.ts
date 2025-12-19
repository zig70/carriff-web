import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
import express from 'express';
import { join } from 'node:path';
import compression from 'compression';

import * as dotenv from 'dotenv';

// <--- NEW: Load .env file only in development
if (process.env['NODE_ENV'] !== 'production') {
  dotenv.config();
}

const browserDistFolder = join(import.meta.dirname, '../browser');

const app = express();
const angularApp = new AngularNodeAppEngine();

app.use(compression());

app.use(express.json());

app.use(
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: false,
    redirect: false,
  }),
);

app.post('/api/chat', async (req, res) => { // <--- NEW
  try {
    const userMessage = req.body.message;
    const apiKey = process.env['OPENAI_API_KEY']; 
    console.log('Key loaded:', !!process.env['OPENAI_API_KEY']);
    if (!apiKey) {
      // Use 'return' to stop execution so we don't crash
      res.status(500).json({ error: 'Server missing API Key' });
      return;
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "gpt-4-turbo", 
        messages: [
          { role: "system", content: "You are a helpful assistant." },
          { role: "user", content: userMessage }
        ]
      })
    });

    const data = await response.json();
    res.json(data);

  } catch (error) {
    console.error('Chat Error:', error);
    res.status(500).json({ error: 'Failed to fetch response' });
  }
});

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
