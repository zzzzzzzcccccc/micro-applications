import React from 'react'
import { ProviderGlobal, Router } from './components'

function App() {
  return (
    <ProviderGlobal>
      <Router />
    </ProviderGlobal>
  )
}

export default App
