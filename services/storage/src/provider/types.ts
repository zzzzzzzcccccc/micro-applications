export interface CreateBucketPayload {
  provider: string
  metadata: Record<string, any>
}

export interface UploadStreamPayload {
  provider: string
  metadata: Record<string, any>
  steam: Buffer
  objectName: string
  name: string
  size: number
  type: string
}

export interface DownloadLinkPayload extends Omit<UploadStreamPayload, 'steam'> {}

export interface RemoveStreamPayload {
  provider: string
  metadata: Record<string, any>
  objectName: string
}

export interface ReadSteamPayload {
  provider: string
  metadata: Record<string, any>
  objectName: string
}
