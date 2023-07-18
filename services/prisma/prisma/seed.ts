import { PrismaClient } from './client'
import process from 'process'
import apps from './mock-apps'

const prisma = new PrismaClient()

async function main() {
  await prisma.app.deleteMany()
  const apps = await createApps()
  console.log('created apps ===>', apps)
}

function createApps() {
  return prisma.app.createMany({ data: apps })
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
