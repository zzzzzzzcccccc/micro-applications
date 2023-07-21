export const REDIS_QUERY_FIND_MANY_MAX_TIME = process.env.REDIS_QUERY_FIND_MANY_MAX_TIME
  ? +process.env.REDIS_QUERY_FIND_MANY_MAX_TIME
  : 3600
export const RATE_TTL = process.env.RATE_TTL ? +process.env.RATE_TTL : 60
export const RATE_LIMIT = process.env.RATE_LIMIT ? +process.env.RATE_LIMIT : 10
export const FIND_APPS_REDIS_TAG = 'apps'
export const FIND_FEATURES_REDIS_TAG = 'features'
