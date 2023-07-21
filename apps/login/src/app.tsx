import React from 'react'
import sdk from '@micro/sdk'

export default function App() {
  const app = sdk.app.findByName('login')

  return <div>{app.name}</div>
}
