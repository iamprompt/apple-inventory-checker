import {
  and,
  eq,
  type InferInsertModel,
  type InferSelectModel,
  sql,
} from 'drizzle-orm'
import {
  CompareValuesWithDetailedDifferences,
  type DetailedDifference,
} from 'object-deep-compare'
import { NotificationChannelType } from './constants/notification'
import { db } from './database'
import { notificationChannels } from './database/schema/notificationChannels'
import { productAvailability } from './database/schema/productAvailability'
import { productAvailabilityHistory } from './database/schema/productAvailabilityHistory'
import { products } from './database/schema/products'
import { stores } from './database/schema/stores'
import { getPickupMessageAvailability } from './modules/apple'
import { processPickupMessageAvailabilityByPartNumber } from './modules/apple/helper'
import { sendBarkNotification } from './modules/bark'
import { sendMessage } from './modules/telegram'

export const scheduled = async (): Promise<void> => {
  console.log('Running scheduled task at', new Date().toISOString())

  const skuProducts = await db
    .select()
    .from(products)
    .where(eq(products.isUpdateing, true))

  const productsByLocale = skuProducts.reduce(
    (acc, product) => {
      if (!acc.has(product.locale)) {
        acc.set(product.locale, new Map())
      }
      acc.get(product.locale)?.set(product.partNumber, product)
      return acc
    },
    new Map() as Map<string, Map<string, InferSelectModel<typeof products>>>,
  )

  for (const [locale, partNumbersMap] of productsByLocale.entries()) {
    for (const [partNumber, product] of partNumbersMap.entries()) {
      const availability = await getPickupMessageAvailability(
        locale,
        partNumber,
        '10600',
      )

      if (!availability) {
        console.error(`No availability data for locale: ${locale}`)
        continue
      }

      const prodAvailability = processPickupMessageAvailabilityByPartNumber(
        partNumber,
        availability,
      )

      const storesMap = new Map<string, InferSelectModel<typeof stores>>()
      const storesIdsMap = new Map<number, InferSelectModel<typeof stores>>()

      for (const store of prodAvailability) {
        const [storeRecord] = await db
          .insert(stores)
          .values({
            storeId: store.storeNumber,
            name: store.storeName,
          })
          .onConflictDoUpdate({
            target: stores.storeId,
            set: {
              name: store.storeName,
            },
          })
          .returning()

        if (!storeRecord) {
          continue
        }

        storesMap.set(store.storeNumber, storeRecord)
        storesIdsMap.set(storeRecord.id, storeRecord)
      }

      const updatedAvailability = prodAvailability.map<
        InferInsertModel<typeof productAvailability>
      >((product) => ({
        partNumber: partNumber,
        productId: partNumbersMap.get(partNumber)?.id,
        storeId: storesMap.get(product.storeNumber)?.id!,
        availabilityText: product.availabilityText,
        isAvailable: product.isAvailable,
        locale,
      }))

      for (const avail of updatedAvailability) {
        const [before] = await db
          .select()
          .from(productAvailability)
          .where(
            and(
              eq(productAvailability.locale, avail.locale),
              eq(productAvailability.partNumber, avail.partNumber),
              eq(productAvailability.storeId, avail.storeId),
            ),
          )
          .limit(1)

        let differences: DetailedDifference[] = []

        if (before) {
          const beforeObj = {
            availabilityText: before.availabilityText,
            isAvailable: before.isAvailable,
          }

          const afterObj = {
            availabilityText: avail.availabilityText,
            isAvailable: avail.isAvailable,
          }

          differences = CompareValuesWithDetailedDifferences(
            beforeObj,
            afterObj,
          )
        }

        if (before && differences.length === 0) {
          continue
        }

        const product = partNumbersMap.get(avail.partNumber)!

        const message = (() => {
          if (avail.isAvailable) {
            return `🟢 ${product.name} (${product.partNumber})\n📍 ${storesIdsMap.get(avail.storeId)?.name} (${storesIdsMap.get(avail.storeId)?.storeId})\n📱 Available (${avail.availabilityText})`
          }

          return `🔴 ${product.name} (${product.partNumber})\n📍 ${storesIdsMap.get(avail.storeId)?.name} (${storesIdsMap.get(avail.storeId)?.storeId})\n📱 Unavailable (${avail.availabilityText})`
        })()

        const productUrl = `https://www.apple.com/${product.locale}/shop/product/${product.partNumber}`

        const notiChannels = await db
          .select()
          .from(notificationChannels)
          .where(
            and(
              eq(notificationChannels.isActive, true),
              sql`${notificationChannels.productIds} @> ${sql`to_jsonb(ARRAY[${product.id}]::int[])`}`,
            ),
          )

        console.log(notiChannels)

        for (const channel of notiChannels) {
          switch (channel.type) {
            case NotificationChannelType.TELEGRAM: {
              if (!channel.token || !channel.targets.length) {
                console.error(
                  `Telegram channel ${channel.id} is missing token or chatId`,
                )
                continue
              }

              for (const target of channel.targets) {
                await sendMessage(channel.token, target, message, {
                  reply_markup: {
                    inline_keyboard: [[{ text: 'ดูสินค้า', url: productUrl }]],
                  },
                })
              }

              break
            }
            case NotificationChannelType.BARK: {
              if (!channel.targets.length) {
                console.error(
                  `Bark channel ${channel.id} is missing device key`,
                )
                continue
              }

              await sendBarkNotification({
                title: 'Apple Inventory Checker',
                body: message,
                url: productUrl,
                id: `${avail.partNumber}-${avail.storeId}`,
                device_keys: channel.targets,
                level: avail.isAvailable ? 'critical' : 'active',
                volume: 10,
              })
              break
            }
          }
        }

        const [updatedAvail] = await db
          .insert(productAvailability)
          .values(avail)
          .onConflictDoUpdate({
            target: [
              productAvailability.locale,
              productAvailability.partNumber,
              productAvailability.storeId,
            ],
            set: avail,
          })
          .returning()

        await db.insert(productAvailabilityHistory).values({
          ...updatedAvail,
          id: undefined,
          createdAt: undefined,
          updatedAt: undefined,
        })
      }
    }
  }
}
