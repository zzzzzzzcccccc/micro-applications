import React, { useRef, useEffect } from 'react'
import { ContainerProps } from './types'
import sdk from '@micro/sdk'

function Container(props: ContainerProps) {
  const { app, className, style } = props
  const ref = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    sdk.remoteModule.load(app).then((module) => {
      module.default(ref.current, { app })
    })
  }, [])

  return <div className={[app.appName, className].filter(Boolean).join(' ')} style={style} ref={ref} />
}

export default Container
