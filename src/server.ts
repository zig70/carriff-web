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

function calculateQuote(petType: string, age: number): string {
  let basePrice = 10; // Base price £10
  
  if (petType.toLowerCase().includes('dog')) basePrice += 15; // Dogs are expensive
  if (petType.toLowerCase().includes('cat')) basePrice += 5;  // Cats are cheaper
  
  const finalPrice = basePrice + (age * 2); // Add £2 for every year of age
  
  return `£${finalPrice.toFixed(2)} per month`;
}

app.post('/api/chat', async (req, res) => {
  try {
    const userMessage = req.body.message;
    const apiKey = process.env['OPENAI_API_KEY'];

    if (!apiKey) {
      res.status(500).json({ error: 'Server missing API Key' });
      return;
    }

    // 1. Define the Tools available to the AI
    const tools = [
      {
        type: "function",
        function: {
          name: "get_quote",
          description: "Calculates a pet insurance quote based on pet type and age",
          parameters: {
            type: "object",
            properties: {
              petType: { type: "string", enum: ["dog", "cat", "rabbit"], description: "The type of pet" },
              age: { type: "integer", description: "The age of the pet in years" },
            },
            required: ["petType", "age"],
          },
        },
      }
    ];

    // 2. Define the System Persona
    const messages: any[] = [
      { 
        role: "system", 
        content: "You are a helpful Pet Insurance Assistant for 'Carriff Insurance'. You must ask the user for their Pet's Type and Age before giving a quote. Be friendly." 
      },
      // In a real app, you would pass the full conversation history here so it remembers context
      { role: "user", content: userMessage }
    ];

    // 3. First Call to OpenAI
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
      body: JSON.stringify({
        model: "gpt-4-turbo",
        messages: messages,
        tools: tools,
        tool_choice: "auto" // Let AI decide when to use the tool
      })
    });

    const data = await response.json();
    const responseMessage = data.choices[0].message;

    // 4. CHECK: Did the AI want to call a function?
    if (responseMessage.tool_calls) {
      
      // The AI wants a quote! Let's calculate it.
      const toolCall = responseMessage.tool_calls[0];
      const functionName = toolCall.function.name;
      const functionArgs = JSON.parse(toolCall.function.arguments);

      if (functionName === 'get_quote') {
        const quoteResult = calculateQuote(functionArgs.petType, functionArgs.age);
        
        // 5. Send the result back to OpenAI to formulate the final friendly answer
        // We add the AI's "desire" to call the tool to history...
        messages.push(responseMessage);
        // ...and we add the actual result of the tool
        messages.push({
          role: "tool",
          tool_call_id: toolCall.id,
          content: quoteResult
        });

        // 6. Second Call: Get the final text
        const secondResponse = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
          body: JSON.stringify({
            model: "gpt-4-turbo",
            messages: messages
          })
        });

        const secondData = await secondResponse.json();
        res.json(secondData); // Send final "Here is your quote..." text to Angular
        return;
      }
    }

    // If no tool was called, just return the text (e.g., "Hello, how can I help?")
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
