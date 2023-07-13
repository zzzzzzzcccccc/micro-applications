import { App, Navigation, RemoteModule } from '../api'

class Sdk {
  public app: App
  public navigation: Navigation
  public remoteModule: RemoteModule

  constructor() {
    this.app = new App()
    this.navigation = new Navigation()
    this.remoteModule = new RemoteModule()
  }
}

export default Sdk
