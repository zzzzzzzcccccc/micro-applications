import { Feature, App, Navigation, RemoteModule, Context } from '../api'
import { Options } from './types'

class Sdk {
  public feature: Feature
  public app: App
  public navigation: Navigation
  public remoteModule: RemoteModule
  public context: Context

  constructor(options: Options) {
    const { historyMode } = options

    this.feature = new Feature()
    this.app = new App({ feature: this.feature })
    this.navigation = new Navigation({ historyMode })
    this.remoteModule = new RemoteModule()
    this.context = new Context()
  }
}

export default Sdk
