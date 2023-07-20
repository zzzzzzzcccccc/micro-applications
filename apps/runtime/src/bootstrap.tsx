import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './app'
import { httpClient } from './config'
import sdk from '@micro/sdk'

const element = document.getElementById('root')

if (element) {
  bootstrap(element)
}

function setEnvs() {
  const envs = (window as any)?.RUNTIME_ENV
  if (envs) {
    sdk.app.setEnvs(envs)
  }
}

function bootstrap(target: HTMLElement) {
  setEnvs()

  httpClient.initialize(sdk.app.envs.API_GATEWAY)

  createRoot(target).render(<App />)
}
