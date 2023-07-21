export enum LogLevel {
  ERROR = 'ERROR',
  WARN = 'WARN',
  INFO = 'INFO',
  DEBUG = 'DEBUG',
}

const colorMapper = {
  [LogLevel.ERROR]: 'color: red',
  [LogLevel.WARN]: 'color: orange',
  [LogLevel.INFO]: 'color: blue',
  [LogLevel.DEBUG]: 'color: purple',
}

class Logger {
  constructor(private readonly namespace: string, private readonly level: LogLevel, private readonly disabled = true) {}

  public error<T extends any[]>(message: string, ...args: T) {
    this.log(LogLevel.ERROR, message, ...args)
  }

  public warn<T extends any[]>(message: string, ...args: T) {
    this.log(LogLevel.WARN, message, ...args)
  }

  public info<T extends any[]>(message: string, ...args: T) {
    this.log(LogLevel.INFO, message, ...args)
  }

  public debug<T extends any[]>(message: string, ...args: T) {
    this.log(LogLevel.DEBUG, message, ...args)
  }

  private log<T extends any[]>(level: LogLevel, message: string, ...args: T) {
    if (this.disabled) {
      return
    }
    if (this.shouldLog(level)) {
      const color = colorMapper[level]
      const timestamp = new Date().toISOString()
      const title = `[${timestamp}]%c[${this.namespace}][${level}][${message}]`
      console.groupCollapsed(title, color)
      if (args?.length) {
        console.trace(this.formatArgs(args).join(','))
      }
      console.groupEnd()
    }
  }

  private formatArgs<T extends any[]>(args: T) {
    return args.map((arg) => {
      if (typeof arg === 'object') {
        return JSON.stringify(arg)
      }
      return arg
    })
  }

  private shouldLog(level: LogLevel) {
    const levels = Object.values(LogLevel as Record<string, LogLevel>)
    const currentLevelIndex = levels.indexOf(this.level)
    const targetLevelIndex = levels.indexOf(level)
    return targetLevelIndex <= currentLevelIndex
  }
}

export default Logger
