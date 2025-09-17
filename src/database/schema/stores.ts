import { sql } from 'drizzle-orm'
import { integer, sqliteTable, text, unique } from 'drizzle-orm/sqlite-core'

export const stores = sqliteTable(
  'stores',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    storeId: text('store_id').notNull(),
    name: text('name').notNull(),
    latitude: text('latitude').notNull(),
    longitude: text('longitude').notNull(),
    createdAt: integer('created_at', { mode: 'timestamp' })
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
    updatedAt: integer('updated_at', { mode: 'timestamp' })
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`)
      .$onUpdate(() => new Date()),
  },
  (table) => [unique('unique_store_id').on(table.storeId)],
)
