import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './app'
import sdk from '@micro/sdk'
import { createMemoryHistory } from 'history'

export default function bootstrap<Element extends HTMLElement, Payload extends Record<string, any>>(
  el: Element,
  payload: Payload = {} as Payload,
) {
  const history = createMemoryHistory({
    initialEntries: [sdk.navigation.pathname],
  })
  const app = createRoot(el)
  app.render(<App {...payload} history={history} />)

  const unbind = sdk.navigation.on(({ location }) => {
    if (location.pathname !== history.location.pathname) {
      history.push(location.pathname)
    }
  })

  return () => {
    setTimeout(() => app.unmount(), 0)
    unbind()
  }
}
