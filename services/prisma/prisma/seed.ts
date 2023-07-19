import { PrismaClient } from './client'
import process from 'process'
import apps from './mock-apps'
import features from './mock-feature'

const prisma = new PrismaClient()

async function main() {
  await prisma.app.deleteMany()
  await prisma.feature.deleteMany()

  const apps = await createApps()
  const features = await createFeatures()

  console.log('created apps ===>', apps)
  console.log('created features ===>', features)
}

function createApps() {
  return prisma.app.createMany({ data: apps })
}

function createFeatures() {
  return prisma.feature.createMany({ data: features })
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
