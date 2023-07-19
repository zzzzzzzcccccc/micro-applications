import { Prisma } from './client'

const tenant_id = 'local-tenant'

const features: Prisma.featureCreateInput[] = [
  {
    name: 'home_app_version',
    value: 'v0.0.1',
    tenant_id,
  },
  {
    name: 'login_app_version',
    value: 'v0.0.1',
    tenant_id,
  },
  {
    name: 'dashboard_app_version',
    value: 'v0.0.1',
    tenant_id,
  },
]

export default features
