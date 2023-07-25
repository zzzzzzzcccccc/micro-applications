import { Feature as FeatureModel } from '../../model'
import { FeatureStatus } from '../../enums'
import { logger } from '../../utils'

class Feature {
  private features: FeatureModel[] = []

  public set(payload: FeatureModel[]) {
    this.features = payload
    logger.info('Set features', this.features)
  }

  public getByName(name: string) {
    return this.features.find((item) => item.name === name)
  }

  public isActive(name: string, defaultValue = false) {
    const item = this.getByName(name)
    if (!item) {
      return defaultValue
    }
    if (item.status === FeatureStatus.ROLLOUT) {
      return true
    }
    return item?.value === 'on'
  }

  public get current() {
    return this.features
  }
}

export default Feature
