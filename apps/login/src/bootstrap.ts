import { createApp } from 'vue'
import App from './app'

export default function bootstrap<Element extends HTMLElement>(el: Element) {
  const app = createApp(App)
  app.mount(el)

  return () => {
    app.unmount()
  }
}
