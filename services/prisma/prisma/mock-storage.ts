import { Prisma } from './client'

const tenant_id = 'local-tenant'

const storages: Prisma.storageCreateInput[] = [
  {
    tenant_id,
    status: 'ACTIVE',
    provider: 'MINIO',
    metadata: {
      client_options: {
        endPoint: 'storage',
        port: 9000,
        useSSL: false,
        accessKey: 'fZWTUjWd8TJYMKYay5st',
        secretKey: 'bPEYOEECN23Em17SZRbzOZXUlyvCyySQBdj0g8g3',
      },
    },
  },
]

export default storages
