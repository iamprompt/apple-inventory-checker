import { drizzle } from 'drizzle-orm/node-postgres'
import { env } from '../config'

export const db = drizzle(env.DB_URL)
