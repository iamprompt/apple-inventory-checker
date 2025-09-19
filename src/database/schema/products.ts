import { sql } from 'drizzle-orm'
import { integer, sqliteTable, text, unique } from 'drizzle-orm/sqlite-core'

export const products = sqliteTable(
  'products',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    locale: text('locale').notNull(),
    basePartNumber: text('base_part_number').notNull(),
    partNumber: text('part_number').notNull(),
    capacity: text('capacity').notNull(),
    capacityKey: text('capacity_key'),
    screenSize: text('screen_size').notNull(),
    screenSizeKey: text('screen_size_key'),
    color: text('color').notNull(),
    colorKey: text('color_key'),
    carrierModel: text('carrier_model'),
    carrierModelKey: text('carrier_model_key'),
    imageKey: text('image_key'),
    imageUrl: text('image_url'),
    price: text('price').notNull(),
    url: text('url'),
    name: text('name').notNull(),
    createdAt: integer('created_at', { mode: 'timestamp' })
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
    updatedAt: integer('updated_at', { mode: 'timestamp' })
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`)
      .$onUpdate(() => new Date()),
  },
  (table) => [
    unique('unique_locale_part_number').on(table.locale, table.partNumber),
  ],
)
