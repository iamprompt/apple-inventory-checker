import { sql } from 'drizzle-orm'
import {
  boolean,
  integer,
  pgTable,
  serial,
  timestamp,
  unique,
  varchar,
} from 'drizzle-orm/pg-core'
import { products } from './products'
import { stores } from './stores'

export const productAvailability = pgTable(
  'product_availability',
  {
    id: serial('id').primaryKey(),
    locale: varchar('locale').notNull(),
    productId: integer('product_id').references(() => products.id),
    partNumber: varchar('part_number').notNull(),
    storeId: integer('store_id')
      .references(() => stores.id)
      .notNull(),
    availabilityText: varchar('availability_text'),
    isAvailable: boolean('is_available').default(false),
    createdAt: timestamp('created_at', { mode: 'date' })
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
    updatedAt: timestamp('updated_at', { mode: 'date' })
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`)
      .$onUpdate(() => new Date()),
  },
  (table) => [
    unique('unique_locale_part_store').on(
      table.locale,
      table.partNumber,
      table.storeId,
    ),
  ],
)
