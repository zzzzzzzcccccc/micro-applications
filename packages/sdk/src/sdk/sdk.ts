import { Navigation, RemoteModule } from '../api'

class Sdk {
  public navigation: Navigation
  public remoteModule: RemoteModule

  constructor() {
    this.navigation = new Navigation()
    this.remoteModule = new RemoteModule()
  }
}

export default Sdk
