import { Prisma } from './client'

const workspace = 'micro-applications'
const tenant_id = 'local-tenant'

const features = [
  {
    name: 'home_app_version',
    workspace,
    metadata: {
      conditions: [
        {
          type: 'WHITELIST',
          target: [tenant_id],
          value: 'v0.0.1',
        },
        {
          type: 'ELSE',
          value: 'v0.0.1',
        },
      ],
    },
  },
  {
    name: 'login_app_version',
    workspace,
    metadata: {
      conditions: [
        {
          type: 'WHITELIST',
          target: [tenant_id],
          value: 'v0.0.1',
        },
        {
          type: 'ELSE',
          value: 'v0.0.1',
        },
      ],
    },
  },
  {
    name: 'dashboard_app_version',
    workspace,
    metadata: {
      conditions: [
        {
          type: 'WHITELIST',
          target: [tenant_id],
          value: 'v0.0.1',
        },
        {
          type: 'ELSE',
          value: 'v0.0.1',
        },
      ],
    },
  },
] as Prisma.featureCreateInput[]

export default features
