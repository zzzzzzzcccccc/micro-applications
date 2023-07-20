type NameSpace = string
type IContext = Record<string, any>
type Callback = (payload: IContext) => void

class Context {
  private cbs: Map<string, Set<Callback>> = new Map()
  private contexts: Map<string, IContext> = new Map()

  public on(nameSpace: NameSpace, callback: Callback) {
    const item = this.cbs.get(nameSpace)
    const cbs = item ? item.add(callback) : new Set([callback])
    this.cbs.set(nameSpace, cbs)

    return () => this.off(nameSpace, callback)
  }

  public off(nameSpace: NameSpace, callback: Callback) {
    const item = this.cbs.get(nameSpace)
    if (item?.size) {
      item.delete(callback)
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
    this.cbs.delete(nameSpace)
  }

  private emitCallbacks(nameSpace: string, context: IContext) {
    const item = this.cbs.get(nameSpace)
    if (item?.size) {
      item.forEach((cb) => cb(context))
    }
  }
}

export default Context
