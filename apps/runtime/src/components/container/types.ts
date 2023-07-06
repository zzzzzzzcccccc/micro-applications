import React from 'react'

export type AppConfiguration = {
  appName: string
  remotePath: string
  url: string
}

export interface ContainerProps {
  className?: string
  style?: React.CSSProperties
  app: AppConfiguration
}
