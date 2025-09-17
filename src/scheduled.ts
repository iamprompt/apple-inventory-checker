import { db } from './database'
import { productAvailability } from './database/schema/productAvailability'
import { products } from './database/schema/products'
import { stores } from './database/schema/stores'
import { getProductAvailability } from './modules/apple'
import { chunkArray } from './utils/array'

export const scheduled: ExportedHandlerScheduledHandler<Env> = async (
  event,
  env,
  ctx,
): Promise<void> => {
  const skuProducts = await db
    .select({
      id: products.id,
      partNumber: products.partNumber,
      locale: products.locale,
    })
    .from(products)

  const productsByLocale = skuProducts.reduce(
    (acc, product) => {
      if (!acc.has(product.locale)) {
        acc.set(product.locale, new Map())
      }
      acc.get(product.locale)!.set(product.partNumber, product.id)
      return acc
    },
    new Map() as Map<string, Map<string, number>>,
  )

  for (const [locale, partNumbersMap] of productsByLocale.entries()) {
    const partNumbersInChunks = chunkArray([...partNumbersMap.keys()], 10)

    for (const chunk of partNumbersInChunks) {
      const availability = await getProductAvailability(locale, chunk)

      if (!availability) {
        console.error(`No availability data for locale: ${locale}`)
        continue
      }

      const storeIdsMap = new Map<string, number>()

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

        storeIdsMap.set(store.storeNumber, storeRecord.id)
      }

      const updatedAvailability = availability.pickupMessage.stores.flatMap(
        (store) => {
          return Object.values(store.partsAvailability).map((part) => ({
            partNumber: part.partNumber,
            productId: partNumbersMap.get(part.partNumber)!,
            storeId: storeIdsMap.get(store.storeNumber)!,
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
