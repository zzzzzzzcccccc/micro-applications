import React, { useEffect, useRef } from 'react'
import sdk from '@micro/sdk'
import './app.less'

const Panel = React.lazy(() => sdk.remoteModule.load(sdk.app.findByName('dashboard-panel')?.remoteModule))

export default function App() {
  const containerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    let unbind: () => void
    const target = containerRef.current
    if (target) {
      sdk.remoteModule.load(sdk.app.findByName('dashboard-container')?.remoteModule).then((module) => {
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
