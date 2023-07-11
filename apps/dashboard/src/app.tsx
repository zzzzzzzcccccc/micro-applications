import React, { useEffect, useRef } from 'react'
import sdk from '@micro/sdk'
import './app.less'

const Panel = React.lazy(() =>
  sdk.remoteModule.load({
    url: 'http://localhost:3337/dashboard_panel_app/v0.0.1/remoteEntry.js',
    appName: 'dashboard_panel_app',
    remotePath: './App',
  }),
)

export default function App() {
  const containerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    let unbind: () => void
    const target = containerRef.current
    if (target) {
      sdk.remoteModule
        .load({
          url: 'http://localhost:3338/dashboard_container_app/v0.0.1/remoteEntry.js',
          appName: 'dashboard_container_app',
          remotePath: './App',
        })
        .then((module) => {
          unbind = module.default(target)
        })
    }

    return () => {
      unbind?.()
    }
  }, [])

  return (
    <div className="main">
      <div className="panel">
        <React.Suspense>
          <Panel />
        </React.Suspense>
      </div>
      <div className="container" ref={containerRef} />
    </div>
  )
}
