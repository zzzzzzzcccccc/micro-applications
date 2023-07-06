import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './app';

export default function bootstrap<Element extends HTMLElement, Payload extends Record<string, any>>(el: Element, payload: Payload = {}) {
  createRoot(el).render(<App {...payload} />);
}
