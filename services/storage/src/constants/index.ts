export const RATE_TTL = process.env.RATE_TTL ? +process.env.RATE_TTL : 60
export const RATE_LIMIT = process.env.RATE_LIMIT ? +process.env.RATE_LIMIT : 10
export const ERROR_MESSAGE = {
  MISSING_BUCKET_NAME: 'Missing bucket name',
  MISSING_CLIENT_OPTIONS: 'Missing client options',
  BUCKET_ALREADY_EXISTS: 'Bucket already exists',
  MISSING_ACTIVE_STORAGE: 'Missing active storage',
  CREATE_BUCKET_FAILED: 'Create bucket failed',
  UPLOAD_STEAM_FAILED: 'Upload steam failed',
  MISSING_STORAGE_FILE: 'Missing storage file',
  DOWNLOAD_LINK_FAILED: 'Download link failed',
  REMOVE_STEAM_FAILED: 'Remove steam failed',
}
export const DEFAULT_DOWNLOAD_LINK_EXPIRED = 600
