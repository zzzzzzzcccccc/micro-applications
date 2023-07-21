type NameSpace = string
type IContext = Record<string, any>
type Callback = (payload: IContext) => void

class Context {
  private cbs: Record<string, Callback[]> = {}
  private contexts: Map<string, IContext> = new Map()

  public on(nameSpace: NameSpace, callback: Callback) {
    if (this.cbs[nameSpace]) {
      this.cbs[nameSpace].push(callback)
    } else {
      this.cbs[nameSpace] = [callback]
    }
    return () => this.off(nameSpace, callback)
  }

  public off(nameSpace: NameSpace, callback: Callback) {
    if (this.cbs[nameSpace]) {
      this.cbs[nameSpace] = this.cbs[nameSpace].filter((cb) => cb !== callback)
    }
  }

  public get(nameSpace: string) {
    return this.contexts.get(nameSpace)
  }

  public dispatch(nameSpace: string, context = {} as IContext) {
    const item = this.contexts.get(nameSpace)
    const current = item ? { ...item, ...context } : (context as Context)
    this.contexts.set(nameSpace, current)
    this.emitCallbacks(nameSpace, current)
    return current
  }

  public clean(nameSpace: string) {
    this.contexts.delete(nameSpace)
    this.cbs = {}
  }

  private emitCallbacks(nameSpace: string, context: IContext) {
    if (this.cbs[nameSpace]) {
      this.cbs[nameSpace].forEach((cb) => cb(context))
    }
  }
}

export default Context
