import 'dotenv/config'
import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  out: './drizzle',
  schema: './src/database/schema',
  dialect: 'sqlite',
  dbCredentials: {
    url: process.env.DB_URL!,
  },
})
