import { PrismaClient } from './client'
import process from 'process'
import apps from './mock-apps'
import features from './mock-feature'
import storages from './mock-storage'

const prisma = new PrismaClient()

async function main() {
  await cleanTables()

  const [apps, features, storages] = await createMockData()

  console.log('created apps ===>', apps)
  console.log('created features ===>', features)
  console.log('created storages ===>', storages)
}

function cleanTables() {
  return Promise.all([prisma.app.deleteMany(), prisma.feature.deleteMany(), prisma.storage.deleteMany()])
}

function createMockData() {
  return Promise.all([
    prisma.app.createMany({ data: apps }),
    prisma.feature.createMany({ data: features }),
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
