import { sql } from 'drizzle-orm'
import {
  pgTable,
  serial,
  timestamp,
  unique,
  varchar,
} from 'drizzle-orm/pg-core'

export const stores = pgTable(
  'stores',
  {
    id: serial('id').primaryKey(),
    storeId: varchar('store_id', { length: 10 }).notNull(),
    name: varchar('name', { length: 100 }).notNull(),
    createdAt: timestamp('created_at', { mode: 'date' })
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
    updatedAt: timestamp('updated_at', { mode: 'date' })
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`)
      .$onUpdate(() => new Date()),
  },
  (table) => [unique('unique_store_id').on(table.storeId)],
)
