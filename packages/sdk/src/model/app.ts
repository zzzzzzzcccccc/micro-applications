export enum AppType {
  application = 'application',
  component = 'component',
}

export interface RemoteModule {
  appName: string
  remotePath: string
  url: string
}

export interface App {
  name: string
  path?: string
  frame: 'react' | 'vue'
  type: AppType
  remoteModule: RemoteModule
}
