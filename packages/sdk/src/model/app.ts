export enum AppMode {
  APPLICATION = 'APPLICATION',
  COMPONENT = 'COMPONENT',
}

export enum AppStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

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
  frame: 'REACT' | 'VUE'
  mode: AppMode
  status: AppStatus
  created_at: string
  updated_at: string
  metadata: Record<string, AppMetadata>
}
