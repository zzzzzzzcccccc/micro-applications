import { Feature as FeatureModel, FeatureCondition } from '../../model'
import { Options } from './types'
import { FeatureConditionType } from '../../enums'
import { logger } from '../../utils'
import { ON } from '../../constants'

class Feature {
  private features: FeatureModel[] = []
  private readonly env: Options['env']

  constructor({ env }: Options) {
    this.env = env
  }

  public set(payload: FeatureModel[]) {
    this.features = payload
    logger.info('Set features', this.features)
  }

  public isActive(name: string) {
    return this.getValue(name) === ON
  }

  public get key() {
    return this.env.current.PROVIDER_TENANT_ID as string
  }

  public get current() {
    return this.features
  }

  public getValue(name: string): string {
    const record = this.getByName(name)
    if (!record || !record.metadata?.conditions?.length) {
      return ''
    }
    return this.getValueByConditions(record.metadata.conditions)
  }

  private getByName(name: string) {
    return this.features.find((item) => item.name === name)
  }

  private getValueByConditions(payload: FeatureCondition[]) {
    let value = ''
    for (let i = 0; i < payload.length; i++) {
      const condition = payload[i]
      const type = condition.type
      if (type === FeatureConditionType.WHITELIST && this.getValueByConditionWhiteList(condition)) {
        value = this.getValueByConditionWhiteList(condition)
        break
      }
      if (type === FeatureConditionType.ELSE && Feature.getValueByConditionElse(condition)) {
        value = Feature.getValueByConditionElse(condition)
        break
      }
    }
    return value
  }

  private getValueByConditionWhiteList({ target = [], value }: FeatureCondition) {
    if (target?.indexOf(this.key) > -1) {
      return value
    }
    return ''
  }

  private static getValueByConditionElse({ value }: FeatureCondition) {
    return value
  }
}

export default Feature
