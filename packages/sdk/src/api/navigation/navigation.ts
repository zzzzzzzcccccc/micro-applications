import { createBrowserHistory, createHashHistory, Update, To, BrowserHistory, HashHistory } from 'history'
import { Options, Callback } from './types'
import { logger } from '../../utils'

class Navigation {
  private history: BrowserHistory | HashHistory
  private subscribers: Set<Callback> = new Set()

  constructor(options: Options) {
    const { historyMode } = options
    this.history = historyMode === 'hash' ? createHashHistory() : createBrowserHistory()
    this.history.listen(this.handleHistoryChange.bind(this))
  }

  public get update() {
    return {
      action: this.history.action,
      location: this.history.location,
    }
  }

  public get pathname() {
    return this.history.location.pathname
  }

  public on(callback: Callback) {
    this.subscribers.add(callback)
    return () => {
      this.off(callback)
    }
  }

  public off(callback: Callback) {
    if (this.subscribers.has(callback)) {
      this.subscribers.delete(callback)
    }
  }

  public push(to: To, state?: any) {
    this.history.push(to, state)
  }

  public replace(to: To, state?: any) {
    this.history.replace(to, state)
  }

  public go(delta: number) {
    this.history.go(delta)
  }

  private handleHistoryChange(update: Update) {
    logger.info('Navigation change', update)
    if (this.subscribers.size) {
      this.subscribers.forEach((callback) => callback(update))
    }
  }
}

export default Navigation
