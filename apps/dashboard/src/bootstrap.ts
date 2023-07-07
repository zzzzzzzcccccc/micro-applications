import { createApp } from 'vue'
import App from './app'

export default function bootstrap<Element extends HTMLElement, Payload extends Record<string, any>>(
  el: Element,
  payload: Payload = {} as Payload,
) {
  const app = createApp(App)
  app.provide('app', payload)
  app.mount(el)

  return () => {
    app.unmount()
  }
}
