import { PrismaClient } from './client'
import process from 'process'
import features from './mock-feature'
import apps from './mock-apps'
import storages from './mock-storage'

const prisma = new PrismaClient()

async function main() {
  await cleanTables()

  const [features, apps, storages] = await createMockData()
  console.log('created features ===>', features)
  console.log('created apps ===>', apps)
  console.log('created storages ===>', storages)
}

function cleanTables() {
  return Promise.all([prisma.feature.deleteMany(), prisma.app.deleteMany(), prisma.storage.deleteMany()])
}

function createMockData() {
  return Promise.all([
    prisma.feature.createMany({ data: features }),
    prisma.app.createMany({ data: apps }),
    prisma.storage.createMany({ data: storages }),
  ])
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
