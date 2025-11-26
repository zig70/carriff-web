import { JSDOM } from 'jsdom';
import * as importedDOMPurify from 'dompurify';

/**
 * Creates and returns an initialized DOMPurify instance for the server.
 * This function will only run in the Node.js environment during prerendering.
 */
export function getDomPurifyServerInstance() {
  // 1. Create a minimal window environment for DOMPurify to use.
  const window = new JSDOM('').window;

  // 2. Safely get the callable DOMPurify function (handles module interop issues).
  const DOMPurify = (importedDOMPurify as any).default 
      ? (importedDOMPurify as any).default 
      : importedDOMPurify;
      
  // 3. Initialize the server-side sanitizer instance.
  const serverDOMPurify = DOMPurify(window);
  
  return serverDOMPurify;
}