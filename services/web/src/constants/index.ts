export const REDIS_QUERY_FIND_MANY_MAX_TIME = process.env.REDIS_QUERY_FIND_MANY_MAX_TIME
  ? +process.env.REDIS_QUERY_FIND_MANY_MAX_TIME
  : 3600
export const RATE_TTL = process.env.RATE_TTL ? +process.env.RATE_TTL : 60
export const RATE_LIMIT = process.env.RATE_LIMIT ? +process.env.RATE_LIMIT : 10
