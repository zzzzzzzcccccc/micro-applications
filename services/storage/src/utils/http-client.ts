import axios, { AxiosInstance, CreateAxiosDefaults } from 'axios'

class HttpClient {
  private instance: AxiosInstance

  public createInstance(options: CreateAxiosDefaults) {
    if (!this.instance) {
      this.instance = axios.create(options)
    }
    return this.instance
  }

  get current() {
    if (!this.instance) {
      throw new Error('Axios instance is not initialized')
    }
    return this.instance
  }
}

const httpClient = new HttpClient()

export { AxiosInstance, CreateAxiosDefaults }

export default httpClient
