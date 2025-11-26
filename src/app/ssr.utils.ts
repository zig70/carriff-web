import { JSDOM } from 'jsdom';
import * as importedDOMPurify from 'dompurify';

// This function initializes the necessary environment for DOMPurify to run in Node
export function initializeServerSanitizer() {
    // 1. Create the window environment for SSR
    const window = new JSDOM('').window;

    // 2. Safely get the callable DOMPurify function
    const DOMPurify = (importedDOMPurify as any).default 
        ? (importedDOMPurify as any).default 
        : importedDOMPurify;
        
    // 3. Initialize the server-side sanitizer instance
    const serverDOMPurify = DOMPurify(window);
    
    return serverDOMPurify;
}