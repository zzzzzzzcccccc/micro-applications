import { Feature, App, Navigation, RemoteModule, Context } from '../api'

class Sdk {
  public feature: Feature
  public app: App
  public navigation: Navigation
  public remoteModule: RemoteModule
  public context: Context

  constructor() {
    this.feature = new Feature()
    this.app = new App()
    this.navigation = new Navigation()
    this.remoteModule = new RemoteModule()
    this.context = new Context()
  }
}

export default Sdk
