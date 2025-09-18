import { drizzle } from 'drizzle-orm/better-sqlite3'
import { env } from '../config'

export const db = drizzle(env.DB_URL)
