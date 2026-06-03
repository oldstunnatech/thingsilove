import 'dotenv/config'
import pkg from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import pg from 'pg'

const { PrismaClient } = pkg
const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
})
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter } as any)

async function main() {
  const products = [
    { name: 'Oversized Tee Vol.3', slug: 'oversized-tee-vol-3', price: 25000, stock: 20, category: 'Tops', isNew: true, isFeatured: true },
    { name: 'Cargo Joggers', slug: 'cargo-joggers', price: 45000, stock: 15, category: 'Bottoms', isNew: true, isFeatured: false },
    { name: 'Puffer Jacket', slug: 'puffer-jacket', price: 75000, stock: 10, category: 'Outerwear', isNew: true, isFeatured: true },
    { name: 'Knit Beanie', slug: 'knit-beanie', price: 15000, stock: 30, category: 'Accessories', isNew: true, isFeatured: false },
    { name: 'Graphic Hoodie', slug: 'graphic-hoodie', price: 40000, stock: 25, category: 'Tops', isNew: false, isFeatured: true },
    { name: 'Slim Track Pants', slug: 'slim-track-pants', price: 35000, stock: 18, category: 'Bottoms', isNew: false, isFeatured: false },
    { name: 'Bucket Hat', slug: 'bucket-hat', price: 18000, stock: 40, category: 'Accessories', isNew: false, isFeatured: false },
    { name: 'Coach Jacket', slug: 'coach-jacket', price: 60000, stock: 12, category: 'Outerwear', isNew: false, isFeatured: true },
  ]

  for (const product of products) {
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: {},
      create: product,
    })
  }

  console.log('✅ Database seeded!')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
