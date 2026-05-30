import Database from 'better-sqlite3'
import path from 'path'

const db = new Database(path.resolve('./prisma/dev.db'))

const products = [
  { name: 'Oversized Tee Vol.3', slug: 'oversized-tee-vol-3', price: 25000, stock: 20, category: 'Tops', isNew: 1, isFeatured: 1 },
  { name: 'Cargo Joggers', slug: 'cargo-joggers', price: 45000, stock: 15, category: 'Bottoms', isNew: 1, isFeatured: 0 },
  { name: 'Puffer Jacket', slug: 'puffer-jacket', price: 75000, stock: 10, category: 'Outerwear', isNew: 1, isFeatured: 1 },
  { name: 'Knit Beanie', slug: 'knit-beanie', price: 15000, stock: 30, category: 'Accessories', isNew: 1, isFeatured: 0 },
  { name: 'Graphic Hoodie', slug: 'graphic-hoodie', price: 40000, stock: 25, category: 'Tops', isNew: 0, isFeatured: 1 },
  { name: 'Slim Track Pants', slug: 'slim-track-pants', price: 35000, stock: 18, category: 'Bottoms', isNew: 0, isFeatured: 0 },
  { name: 'Bucket Hat', slug: 'bucket-hat', price: 18000, stock: 40, category: 'Accessories', isNew: 0, isFeatured: 0 },
  { name: 'Coach Jacket', slug: 'coach-jacket', price: 60000, stock: 12, category: 'Outerwear', isNew: 0, isFeatured: 1 },
]

db.prepare('DELETE FROM Product').run()

const insert = db.prepare(`
  INSERT INTO Product (id, name, slug, price, stock, category, images, isNew, isFeatured, createdAt, updatedAt)
  VALUES (lower(hex(randomblob(16))), @name, @slug, @price, @stock, @category, '[]', @isNew, @isFeatured, datetime('now'), datetime('now'))
`)

for (const product of products) {
  insert.run(product)
}

console.log('✅ Database re-seeded with Naira prices!')
db.close()
