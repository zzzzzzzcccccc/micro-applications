import React from 'react'
import sdk from '@micro/sdk'
import './app.less'

const Panel = React.lazy(() => sdk.remoteModule.load(sdk.app.findByName('dashboard-panel')?.remoteModule))
const Container = React.lazy(() => sdk.remoteModule.load(sdk.app.findByName('dashboard-container')?.remoteModule))

export default function App() {
  return (
    <div className="main">
      <div className="panel">
        <React.Suspense>
          <Panel />
        </React.Suspense>
      </div>
      <div className="container">
        <React.Suspense>
          <Container />
        </React.Suspense>
      </div>
    </div>
  )
}
