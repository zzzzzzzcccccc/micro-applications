import { FeatureStatus } from '../enums'

export interface FeatureMetadata {}

export interface Feature {
  id: string
  tenant_id: string
  name: string
  value: string
  status: FeatureStatus
  metadata?: FeatureMetadata
  created_at: string
  updated_at: string
}
