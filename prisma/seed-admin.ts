import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import pg from 'pg'
import bcrypt from 'bcryptjs'
import 'dotenv/config'

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function createAdmin() {
  console.log('🔐 Creating admin user...')

  const hashedPassword = await bcrypt.hash('admin123', 12)

  const admin = await prisma.user.upsert({
    where: { email: 'admin@simone.com.br' },
    update: {
      password: hashedPassword,
      role: 'ADMIN',
      name: 'Administrador',
    },
    create: {
      email: 'admin@simone.com.br',
      password: hashedPassword,
      name: 'Administrador',
      role: 'ADMIN',
    },
  })

  console.log('✅ Admin user created!')
  console.log('   Email: admin@simone.com.br')
  console.log('   Password: admin123')
  console.log('   Role: ADMIN')

  await prisma.$disconnect()
}

createAdmin().catch(console.error)
