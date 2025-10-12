import { sql } from 'drizzle-orm'
import {
  boolean,
  jsonb,
  pgEnum,
  pgTable,
  serial,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core'
import { NotificationChannelType } from '../../constants/notification'

export const NotificationChannelTypeEnum = pgEnum(
  'NotificationChannelType',
  NotificationChannelType,
)

export const notificationChannels = pgTable('notification_channels', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }),
  type: NotificationChannelTypeEnum('type').notNull(),
  isActive: boolean('is_active').default(true),
  token: varchar('token', { length: 255 }),
  targets: jsonb('targets').$type<string[]>().notNull().default(sql`'[]'`),
  productIds: jsonb('products').$type<number[]>().notNull().default(sql`'[]'`),
  createdAt: timestamp('created_at', { mode: 'date' })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  updatedAt: timestamp('updated_at', { mode: 'date' })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`)
    .$onUpdate(() => new Date()),
})
