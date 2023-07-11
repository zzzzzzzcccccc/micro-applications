import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './app'

export default function bootstrap<Element extends HTMLElement, Payload extends Record<string, any>>(
  el: Element,
  payload: Payload = {} as Payload,
) {
  const app = createRoot(el)
  app.render(<App {...payload} />)

  return () => {
    setTimeout(() => app.unmount(), 0)
  }
}
