import { LoadPayload } from './types'
import { addScript, loadModule } from '../../utils'

class RemoteModule {
  private cache = new Map<string, any>()

  public async load<T>({ url, appName, remotePath }: LoadPayload) {
    const key = `${appName}@${url}:${remotePath}`
    if (this.cache.has(key)) {
      return this.cache.get(key)
    }
    await addScript(url)
    const module = await loadModule<T>({ appName, remotePath })
    this.cache.set(key, module)
    return module
  }

  public destroy({ url, appName, remotePath }: LoadPayload) {
    const key = `${appName}@${url}:${remotePath}`
    if (this.cache.has(key)) {
      this.cache.delete(key)
    }
  }
}

export default RemoteModule
