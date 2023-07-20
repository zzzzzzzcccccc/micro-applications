import { App as AppModel } from '../../model'
import { logger } from '../../utils'

class App {
  private currentEnv: Record<string, any> = {}
  private apps: AppModel[] = []

  public setEnvs(payload: Record<string, any>) {
    const current = { ...this.currentEnv, ...payload }
    this.currentEnv = current
    logger.info('set envs', current)
  }

  public set(payload: AppModel[]) {
    this.apps = payload.map((app) => this.transformApp(app))
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
      ...payload.metadata[BUILD_ENV],
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
