import { FeatureStatus, FeatureConditionType } from '../enums'

export interface FeatureCondition {
  type: FeatureConditionType
  value: string
  target?: string[]
}

export interface FeatureMetadata {
  conditions: FeatureCondition[]
}

export interface Feature {
  id: string
  workspace: string
  name: string
  created_at: string
  updated_at: string
  status: FeatureStatus
  metadata?: FeatureMetadata
}
