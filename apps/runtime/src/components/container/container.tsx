import React, { useRef, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { ContainerProps } from './types'
import sdk from '@micro/sdk'

const appMapper = {
  home: {
    path: '/home',
    appName: 'home_app',
    remotePath: './App',
    url: 'http://localhost:3334/home_app/v0.0.1/remoteEntry.js',
  },
  login: {
    path: '/login',
    appName: 'login_app',
    remotePath: './App',
    url: 'http://localhost:3335/login_app/v0.0.1/remoteEntry.js',
  },
}

function Container(props: ContainerProps) {
  const { className, style } = props
  const ref = useRef<HTMLDivElement | null>(null)
  const { workspace } = useParams()
  const app = appMapper[workspace]

  useEffect(() => {
    let unmount: () => void
    if (app) {
      const target = ref.current as HTMLDivElement
      const app = appMapper[workspace]

      sdk.remoteModule.load(app).then((module) => {
        unmount = module.default(target, { app })
      })
    }

    return () => {
      unmount?.()
    }
  }, [app])

  return <div className={[workspace, className].filter(Boolean).join(' ')} style={style} ref={ref} />
}

export default Container
