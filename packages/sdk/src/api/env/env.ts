class Env {
  private disabled = false
  private env: Record<string, any> = {}

  public set(payload: Record<string, any>) {
    if (!this.disabled) {
      this.env = payload
      this.disabled = true
    }
  }

  public get<T = string>(key: string, defaultValue?: T) {
    return this.env[key] ?? defaultValue
  }

  get current() {
    return this.env
  }
}

export default Env
