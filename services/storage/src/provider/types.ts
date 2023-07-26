export interface CreateBucketPayload {
  provider: string
  metadata: Record<string, any>
}

export interface UploadSteamPayload {
  provider: string
  metadata: Record<string, any>
  steam: Buffer
  objectName: string
  name: string
  size: number
  type: string
}

export interface DownloadLinkPayload extends Omit<UploadSteamPayload, 'steam'> {}

export interface RemoveSteamPayload {
  provider: string
  metadata: Record<string, any>
  objectName: string
}
