import Logger, { LogLevel } from '@micro/logger'

const DEV_MODE = process?.env?.NODE_ENV || 'development' === 'development'
const logger = new Logger('MicroSdk', LogLevel.DEBUG, !DEV_MODE)

export default logger
