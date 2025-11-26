import { InjectionToken } from '@angular/core';

// Define a token to represent the DOMPurify instance
export const DOMPURIFY_TOKEN = new InjectionToken<any>('DOMPurify instance');