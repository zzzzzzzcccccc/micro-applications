import { AppFrame, AppMode, AppStatus } from '../enums'

export interface RemoteModule {
  appName: string
  remotePath: string
  url: string
}

export interface AppMetadata {
  remoteModule: RemoteModule
}

export interface App {
  id: string
  name: string
  path?: string
  frame: AppFrame
  mode: AppMode
  status: AppStatus
  created_at: string
  updated_at: string
  metadata: Record<string, AppMetadata>
}
