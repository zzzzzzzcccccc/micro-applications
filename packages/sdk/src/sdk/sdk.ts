import { Env, Feature, App, Navigation, RemoteModule, Context } from '../api'
import { Options } from './types'

class Sdk {
  public env: Env
  public feature: Feature
  public app: App
  public navigation: Navigation
  public remoteModule: RemoteModule
  public context: Context

  constructor(options: Options) {
    const { historyMode } = options

    this.env = new Env()
    this.feature = new Feature({ env: this.env })
    this.app = new App({ feature: this.feature, env: this.env })
    this.navigation = new Navigation({ historyMode })
    this.remoteModule = new RemoteModule()
    this.context = new Context()
  }
}

export default Sdk
