import { App as AppModel } from '../../model'

class App {
  private apps: AppModel[] = []

  public set(payload: AppModel[]) {
    this.apps = payload
  }

  public findByName(target: string) {
    return this.apps.find((app) => app.name === target)
  }

  public filterByField<T = any>(field: keyof AppModel, value: T) {
    return this.apps.filter((app) => app[field] === value)
  }

  get current() {
    return this.apps
  }
}

export default App
