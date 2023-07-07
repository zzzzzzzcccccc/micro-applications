import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './app'

let app: ReturnType<typeof createRoot>

export default function bootstrap<Element extends HTMLElement, Payload extends Record<string, any>>(
  el: Element,
  payload: Payload = {} as Payload,
) {
  if (!app) {
    app = createRoot(el)
  }
  app.render(<App {...payload} />)

  return () => null
}
