import { createHashHistory } from 'history'
import { Callback, Update, To } from './types'

class Navigation {
  private history = createHashHistory()
  private subscribers: Set<Callback> = new Set()

  constructor() {
    this.history.listen(this.handleHistoryChange.bind(this))
  }

  public get update() {
    return {
      action: this.history.action,
      location: this.history.location,
    }
  }

  public get currentPathname() {
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
    if (this.subscribers.size) {
      this.subscribers.forEach((callback) => callback(update))
    }
  }
}

export default Navigation
