import { App as AppModel, AppMetadata } from '../../model'
import { logger } from '../../utils'
import { Options } from './types'

class App {
  private currentEnv: Record<string, any> = {}
  private apps: AppModel[] = []
  private readonly feature: Options['feature']

  constructor({ feature }: Options) {
    this.feature = feature
  }

  public setEnvs(payload: Record<string, any>) {
    this.currentEnv = { ...this.currentEnv, ...payload }
    logger.info('Set envs', this.currentEnv)
  }

  public set(payload: AppModel[]) {
    this.apps = payload.map((app) => this.transformApp(app))
    logger.info('Set apps', this.apps)
  }

  public findByName(target: string) {
    return this.apps.find((app) => app.name === target)
  }

  public filterByField<T = any>(field: keyof AppModel, value: T) {
    return this.apps.filter((app) => app[field] === value)
  }

  private transformApp(payload: AppModel) {
    const { BUILD_ENV = 'development' } = this.currentEnv
    return {
      ...payload,
      ...this.transformMetadata(payload.metadata[BUILD_ENV]),
    }
  }

  private transformMetadata(metadata: AppMetadata) {
    this.transformRemoteModule(metadata)
    return metadata
  }

  private transformRemoteModule(metadata: AppMetadata) {
    if (!metadata.remoteModule) return
    const regex = /{{([^{}]+)}}/
    const match = (metadata.remoteModule.url || '').match(regex)
    if (match && match.length) {
      const value = match[1].trim()
      const [featureName, defaultValue] = value.split(':-')
      const feature = this.feature.getByName(featureName)
      const target = feature ? feature.value : defaultValue
      metadata.remoteModule.url = metadata.remoteModule.url.replace(regex, target || '')
    }
  }

  get current() {
    return this.apps
  }

  get envs() {
    return this.currentEnv
  }
}

export default App
