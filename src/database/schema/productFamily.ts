import { sql } from 'drizzle-orm'
import {
  boolean,
  pgTable,
  serial,
  timestamp,
  unique,
  varchar,
} from 'drizzle-orm/pg-core'

export const productFamilies = pgTable(
  'product_families',
  {
    id: serial('id').primaryKey(),
    locale: varchar('locale', { length: 10 }).notNull(),
    family: varchar('family', { length: 50 }).notNull(),
    isActive: boolean('is_active').default(true).notNull(),
    createdAt: timestamp('created_at', { mode: 'date' })
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
    updatedAt: timestamp('updated_at', { mode: 'date' })
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`)
      .$onUpdate(() => new Date()),
  },
  (table) => [unique('unique_locale_family').on(table.locale, table.family)],
)
