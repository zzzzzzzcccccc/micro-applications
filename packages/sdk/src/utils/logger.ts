import Logger, { LogLevel } from '@micro/logger'

const NODE_ENV = process?.env?.NODE_ENV || 'development'
const DEV_MODE = NODE_ENV === 'development'

const logger = new Logger('MicroSdk', LogLevel.DEBUG, !DEV_MODE)

export default logger
