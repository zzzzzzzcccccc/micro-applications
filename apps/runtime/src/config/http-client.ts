import axios, { AxiosInstance, CreateAxiosDefaults } from 'axios'

class HttpClient {
  private axiosInstance: AxiosInstance | null = null

  get instance() {
    return this.axiosInstance as AxiosInstance
  }

  public initialize(gateway: string) {
    if (!this.axiosInstance) {
      this.axiosInstance = axios.create({
        baseURL: gateway,
        timeout: 5000,
      } as CreateAxiosDefaults)
    }
    return this.axiosInstance
  }
}

const httpClient = new HttpClient()

export default httpClient
