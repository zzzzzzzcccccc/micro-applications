import { Feature as FeatureModel } from '../../model'

class Feature {
  private features: FeatureModel[] = []

  public set(payload: FeatureModel[]) {
    this.features = payload
  }

  public isActive(name: string, defaultValue = false) {
    const item = this.features.find((item) => item.name === name)
    if (!item) {
      return defaultValue
    }
    // if (item.status === FeatureStatus.ROLLOUT) {
    //   return true
    // }
  }
}

export default Feature
