import { sql } from 'drizzle-orm'
import { integer, sqliteTable, text, unique } from 'drizzle-orm/sqlite-core'
import { products } from './products'
import { stores } from './stores'

export const productAvailability = sqliteTable(
  'product_availability',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    locale: text('locale').notNull(),
    productId: integer('product_id').references(() => products.id),
    partNumber: text('part_number').notNull(),
    storeId: integer('store_id')
      .references(() => stores.id)
      .notNull(),
    storePickEligible: integer('store_pick_eligible', {
      mode: 'boolean',
    }).default(false),
    pickupSearchQuote: text('pickup_search_quote'),
    pickupType: text('pickup_type'),
    pickupDisplay: text('pickup_display'),
    buyability: integer('buyability', { mode: 'boolean' }).default(false),
    createdAt: integer('created_at', { mode: 'timestamp' })
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
    updatedAt: integer('updated_at', { mode: 'timestamp' })
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
