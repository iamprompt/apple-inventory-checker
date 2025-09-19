import { and, eq, type InferSelectModel } from 'drizzle-orm'
import { CompareValuesWithDetailedDifferences } from 'object-deep-compare'
import { env } from './config'
import { db } from './database'
import { productAvailability } from './database/schema/productAvailability'
import { products } from './database/schema/products'
import { stores } from './database/schema/stores'
import { getProductAvailability } from './modules/apple'
import { sendMessage } from './modules/telegram'
import { chunkArray } from './utils/array'

export const scheduled = async (): Promise<void> => {
  console.log('Running scheduled task...')

  const skuProducts = await db.select().from(products)

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
    const partNumbersInChunks = chunkArray([...partNumbersMap.keys()], 1)

    for (const chunk of partNumbersInChunks) {
      const availability = await getProductAvailability(locale, chunk)

      if (!availability) {
        console.error(`No availability data for locale: ${locale}`)
        continue
      }

      const storesMap = new Map<string, InferSelectModel<typeof stores>>()
      const storesIdsMap = new Map<number, InferSelectModel<typeof stores>>()

      for (const store of availability.pickupMessage.stores) {
        const [storeRecord] = await db
          .insert(stores)
          .values({
            storeId: store.storeNumber,
            name: store.storeName,
            latitude: String(store.retailStore.latitude),
            longitude: String(store.retailStore.longitude),
          })
          .onConflictDoUpdate({
            target: stores.storeId,
            set: {
              name: store.storeName,
              latitude: String(store.retailStore.latitude),
              longitude: String(store.retailStore.longitude),
            },
          })
          .returning()

        if (!storeRecord) {
          continue
        }

        storesMap.set(store.storeNumber, storeRecord)
        storesIdsMap.set(storeRecord.id, storeRecord)
      }

      const updatedAvailability = availability.pickupMessage.stores.flatMap(
        (store) => {
          return Object.values(store.partsAvailability).map((part) => ({
            partNumber: part.partNumber,
            productId: partNumbersMap.get(part.partNumber)?.id,
            storeId: storesMap.get(store.storeNumber)?.id!,
            storePickEligible: part.storePickEligible,
            pickupSearchQuote: part.pickupSearchQuote,
            pickupType: part.pickupType,
            pickupDisplay: part.pickupDisplay,
            buyability: part.buyability.isBuyable,
            locale,
          }))
        },
      )

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

        if (before) {
          const beforeObj = {
            storePickEligible: Boolean(before.storePickEligible),
            pickupSearchQuote: before.pickupSearchQuote,
            pickupType: before.pickupType,
            pickupDisplay: before.pickupDisplay,
            buyability: Boolean(before.buyability),
          }

          const afterObj = {
            storePickEligible: Boolean(avail.storePickEligible),
            pickupSearchQuote: avail.pickupSearchQuote,
            pickupType: avail.pickupType,
            pickupDisplay: avail.pickupDisplay,
            buyability: Boolean(avail.buyability),
          }

          const diff = CompareValuesWithDetailedDifferences(beforeObj, afterObj)

          if (diff.length === 0) {
            continue
          }

          const product = partNumbersMap.get(avail.partNumber)!

          const textLines = diff.map((d) => {
            switch (d.path) {
              case 'storePickEligible': {
                return `Store Pick Eligible: ${String(d.oldValue)} -> ${String(
                  d.newValue,
                )}`
              }
              case 'buyability': {
                return `Buyability: ${String(d.oldValue)} -> ${String(
                  d.newValue,
                )}`
              }
              case 'pickupSearchQuote': {
                return `Pickup Search Quote: ${d.oldValue} -> ${d.newValue}`
              }
              case 'pickupType': {
                return `Pickup Type: ${d.oldValue} -> ${d.newValue}`
              }
              case 'pickupDisplay': {
                return `Pickup Display: ${d.oldValue} -> ${d.newValue}`
              }
              default:
                return `${d.path}: ${d.oldValue} -> ${d.newValue}`
            }
          })

          const message = `🚨 *Apple Store Availability Update* 🚨\n*Product:* ${product.name} (${product.partNumber})\n*Store:* ${storesIdsMap.get(avail.storeId)?.name} (${storesIdsMap.get(avail.storeId)?.storeId})\n*Changes:*\n${textLines.map((line) => `- ${line}`).join('\n')}`

          await sendMessage(env.TELEGRAM_CHANNEL_CHAT_ID, message, {
            reply_markup: {
              inline_keyboard: [[{ text: 'View Product', url: product.url }]],
            },
          })
        }

        await db
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
      }
    }
  }
}
