import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './app'
import { httpClient } from './config'

const element = document.getElementById('root')

if (element) {
  httpClient.initialize('http://localhost:4000/api')

  createRoot(element).render(<App />)
}
