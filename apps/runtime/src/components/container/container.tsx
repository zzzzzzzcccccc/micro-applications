import React, { useRef, useEffect, useState, useCallback } from 'react'
import { useParams } from 'react-router-dom'
import { ContainerProps } from './types'
import sdk from '@micro/sdk'

enum ModuleState {
  PENDING = 'PENDING',
  DONE = 'DONE',
  ERROR = 'ERROR',
}

function Container(props: ContainerProps) {
  const { className, style } = props
  const [moduleState, setModuleState] = useState(ModuleState.PENDING)
  const ref = useRef<HTMLDivElement | null>(null)
  const { name } = useParams()
  const app = sdk.app.findByName(name as string)

  const mounted = useCallback(async () => {
    try {
      setModuleState(ModuleState.PENDING)

      const module = await sdk.remoteModule.load(app.remoteModule)
      const target = ref.current as HTMLDivElement
      const unmount = module.default(target)

      target.className = name as string

      setModuleState(ModuleState.DONE)

      return () => {
        unmount()
      }
    } catch (e) {
      setModuleState(ModuleState.ERROR)
      return null
    }
  }, [app, name])

  useEffect(() => {
    let unmount: (() => void) | null = null
    mounted().then((result) => (unmount = result))
    return () => {
      unmount?.()
    }
  }, [app, name, mounted])

  return (
    <div className={className} style={style}>
      {moduleState === ModuleState.PENDING && 'loading...'}
      <div key={name} ref={ref} style={{ display: moduleState !== ModuleState.DONE ? 'none' : 'block' }} />
    </div>
  )
}

export default Container
