import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './app'
import { httpClient } from './config'
import sdk from '@micro/sdk'

const element = document.getElementById('root')

if (element) {
  const envs = (window as any)?.RUNTIME_ENV as Record<string, any> | null
  envs && sdk.app.setEnvs(envs)

  httpClient.initialize(sdk.app.envs.API_GATEWAY)

  createRoot(element).render(<App />)
}
