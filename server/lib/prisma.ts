import Database from 'better-sqlite3'
import path from 'path'

const db = new Database(path.resolve('./prisma/dev.db'))

export { db }
