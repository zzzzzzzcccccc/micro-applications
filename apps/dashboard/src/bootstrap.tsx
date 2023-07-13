import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './app'

export default function bootstrap<Element extends HTMLElement>(el: Element) {
  const app = createRoot(el)
  app.render(<App />)

  return () => {
    setTimeout(() => app.unmount(), 0)
  }
}
