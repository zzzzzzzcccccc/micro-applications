export const RATE_TTL = process.env.RATE_TTL ? +process.env.RATE_TTL : 60
export const RATE_LIMIT = process.env.RATE_LIMIT ? +process.env.RATE_LIMIT : 10
export const ERROR_MESSAGE = {
  MISSING_CLIENT_OPTIONS: 'Missing client options',
  BUCKET_ALREADY_EXISTS: 'Bucket already exists',
  MISSING_ACTIVE_STORAGE: 'Missing active storage',
  CREATE_BUCKET_FAILED: 'Create bucket failed',
}
