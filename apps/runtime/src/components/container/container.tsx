import React, { useRef, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { ContainerProps } from './types'
import sdk from '@micro/sdk'

function Container(props: ContainerProps) {
  const { className, style } = props
  const ref = useRef<HTMLDivElement | null>(null)
  const { name } = useParams()
  const app = sdk.app.findByName(name as string)

  useEffect(() => {
    let unmount: () => void
    if (app?.remoteModule) {
      const target = ref.current as HTMLDivElement
      const el = document.createElement('div')

      target.innerHTML = ''
      el.className = name as string

      sdk.remoteModule.load(app.remoteModule).then((module) => {
        target.appendChild(el)
        unmount = module.default(el)
      })
    }

    return () => {
      unmount?.()
    }
  }, [app, name])

  return <div className={className} style={style} ref={ref} />
}

export default Container
