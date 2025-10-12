import { sql } from 'drizzle-orm'
import {
  boolean,
  pgTable,
  serial,
  timestamp,
  unique,
  varchar,
} from 'drizzle-orm/pg-core'

export const products = pgTable(
  'products',
  {
    id: serial('id').primaryKey(),
    locale: varchar('locale', { length: 10 }).notNull(),
    basePartNumber: varchar('base_part_number', { length: 10 }).notNull(),
    partNumber: varchar('part_number', { length: 20 }).notNull(),
    capacity: varchar('capacity').notNull(),
    capacityKey: varchar('capacity_key'),
    screenSize: varchar('screen_size').notNull(),
    screenSizeKey: varchar('screen_size_key'),
    color: varchar('color').notNull(),
    colorKey: varchar('color_key'),
    carrierModel: varchar('carrier_model'),
    carrierModelKey: varchar('carrier_model_key'),
    imageKey: varchar('image_key'),
    imageUrl: varchar('image_url'),
    price: varchar('price').notNull(),
    url: varchar('url'),
    name: varchar('name').notNull(),
    isUpdateing: boolean('is_updating').default(false).notNull(),
    createdAt: timestamp('created_at', { mode: 'date' })
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
    updatedAt: timestamp('updated_at', { mode: 'date' })
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`)
      .$onUpdate(() => new Date()),
  },
  (table) => [
    unique('unique_locale_part_number').on(table.locale, table.partNumber),
  ],
)
