import { NameSpace, Callback, IContext } from './types'
import { logger } from '../../utils'

class Context {
  private cbs: Map<NameSpace, Set<Callback>> = new Map()
  private contexts: Map<string, IContext> = new Map()

  public on(nameSpace: NameSpace, callback: Callback) {
    logger.info(`Subscription context for ${nameSpace}`, callback)
    if (this.cbs.has(nameSpace)) {
      this.cbs.get(nameSpace)!.add(callback)
    } else {
      this.cbs.set(nameSpace, new Set([callback]))
    }
    return () => this.off(nameSpace, callback)
  }

  public off(nameSpace: NameSpace, callback: Callback) {
    if (this.cbs.has(nameSpace)) {
      this.cbs.get(nameSpace)!.delete(callback)
    }
  }

  public get(nameSpace: string) {
    return this.contexts.get(nameSpace)
  }

  public dispatch(nameSpace: string, context = {} as IContext) {
    const item = this.contexts.get(nameSpace)
    const current = item ? { ...item, ...context } : context
    this.contexts.set(nameSpace, current)
    this.emitCallbacks(nameSpace, current)
    return current
  }

  public clean(nameSpace: string) {
    this.contexts.delete(nameSpace)
    this.cbs.delete(nameSpace)
    logger.info(`Clean context for ${nameSpace}`)
  }

  private emitCallbacks(nameSpace: string, context: IContext) {
    if (this.cbs.has(nameSpace)) {
      this.cbs.get(nameSpace)!.forEach((callback) => callback(context))
    }
  }
}

export default Context
