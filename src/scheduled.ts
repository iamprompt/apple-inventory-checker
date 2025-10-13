import {
  and,
  eq,
  type InferInsertModel,
  type InferSelectModel,
  or,
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
import { productFamilies } from './database/schema/productFamily'
import { products } from './database/schema/products'
import { stores } from './database/schema/stores'
import { getPickupMessageAvailability } from './modules/apple'
import {
  processPickupMessageAvailability,
  type StoreAvailability,
} from './modules/apple/helper'
import { sendBarkNotification } from './modules/bark'
import { sendMessage } from './modules/telegram'

export const scheduled = async (): Promise<void> => {
  console.log('Running scheduled task at', new Date().toISOString())

  const activeFamilies = await db
    .select({
      family: productFamilies.family,
      locale: productFamilies.locale,
    })
    .from(productFamilies)
    .where(eq(productFamilies.isActive, true))

  const skuProducts = await db
    .select()
    .from(products)
    .where(
      or(
        ...activeFamilies.map((fam) =>
          and(eq(products.family, fam.family), eq(products.locale, fam.locale)),
        ),
      ),
    )

  const productsByLocaleAndFamily = skuProducts.reduce<
    Map<string, Map<string, Map<string, InferSelectModel<typeof products>>>>
  >((acc, product) => {
    if (!acc.has(product.locale)) {
      acc.set(product.locale, new Map())
    }

    if (!acc.get(product.locale)!.has(product.family)) {
      acc.get(product.locale)!.set(product.family, new Map())
    }

    acc
      .get(product.locale)!
      .get(product.family)!
      .set(product.partNumber, product)

    return acc
  }, new Map())

  const storesList = await db.select().from(stores)

  if (storesList.length === 0) {
    console.log('No stores found in the database. Please add stores first.')
    return
  }

  const storeMap = new Map<number, InferSelectModel<typeof stores>>(
    storesList.map((store) => [store.id, store]),
  )

  const storeNumberMap = new Map<string, number>(
    storesList.map((store) => [store.storeId, store.id]),
  )

  for (const [locale, familyToProduct] of productsByLocaleAndFamily.entries()) {
    const partAvailabilitiesMap: Array<StoreAvailability> = []

    for (const [family, product] of familyToProduct.entries()) {
      const partAvailabilitiesStoreMap: Map<
        number, // Store ID
        Map<string, StoreAvailability> // Part Number to Availability
      > = new Map()

      console.log(
        `Checking availability for locale: ${locale}, family: ${family}`,
      )
      for (const [partNumber] of product.entries()) {
        for (const store of storeMap.values()) {
          const availability = await getPickupMessageAvailability(
            locale,
            partNumber,
            store.storeId,
          )

          if (!availability) {
            console.error(`No availability data for locale: ${locale}`)
            continue
          }

          const prodAvailability =
            processPickupMessageAvailability(availability)

          for (const avail of prodAvailability) {
            if (!partAvailabilitiesStoreMap.has(store.id)) {
              partAvailabilitiesStoreMap.set(
                store.id,
                new Map<string, StoreAvailability>(),
              )
            }

            partAvailabilitiesStoreMap
              .get(store.id)!
              .set(avail.partNumber, avail)
          }
        }
      }

      const familyPartNumbers = new Set<string>(Array.from(product.keys()))

      const storePartUnavailabilityMap: Map<
        number, // Store ID
        Set<string> // Unavailable Part Numbers
      > = new Map()

      for (const [
        storeId,
        availabilitiesMap,
      ] of partAvailabilitiesStoreMap.entries()) {
        const unavailableParts = new Set<string>()

        for (const partNumber of familyPartNumbers) {
          if (!availabilitiesMap.has(partNumber)) {
            unavailableParts.add(partNumber)
          }
        }

        if (unavailableParts.size > 0) {
          storePartUnavailabilityMap.set(storeId, unavailableParts)
        }

        // Ensure unavailable parts are also recorded in the availability map
        for (const partNumber of unavailableParts) {
          partAvailabilitiesStoreMap.get(storeId)!.set(partNumber, {
            storeNumber: storeMap.get(storeId)!.storeId,
            storeName: storeMap.get(storeId)!.name,
            partNumber,
            availabilityText: 'Unavailable',
            isAvailable: false,
          })
        }

        partAvailabilitiesMap.push(...availabilitiesMap.values())
      }
    }

    const productsMap = Array.from(familyToProduct.values()).reduce<
      Map<string, InferSelectModel<typeof products>>
    >((acc, prodMap) => {
      for (const [partNumber, product] of prodMap.entries()) {
        acc.set(partNumber, product)
      }
      return acc
    }, new Map())

    const updatedAvailability = partAvailabilitiesMap
      .map<InferInsertModel<typeof productAvailability> | null>((product) => {
        if (!productsMap.has(product.partNumber)) {
          return null
        }

        return {
          partNumber: product.partNumber,
          productId: productsMap.get(product.partNumber)!.id,
          storeId: storeNumberMap.get(product.storeNumber)!,
          availabilityText: product.availabilityText,
          isAvailable: product.isAvailable,
          locale,
        }
      })
      .filter(
        (item): item is InferInsertModel<typeof productAvailability> =>
          item !== null,
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

        differences = CompareValuesWithDetailedDifferences(beforeObj, afterObj)
      }

      if (before && differences.length === 0) {
        continue
      }

      const product = productsMap.get(avail.partNumber)!

      const message = (() => {
        if (avail.isAvailable) {
          return `🟢 ${product.name} (${product.partNumber})\n📍 ${storeMap.get(avail.storeId)?.name} (${storeMap.get(avail.storeId)?.storeId})\n📱 Available (${avail.availabilityText})`
        }

        return `🔴 ${product.name} (${product.partNumber})\n📍 ${storeMap.get(avail.storeId)?.name} (${storeMap.get(avail.storeId)?.storeId})\n📱 Unavailable (${avail.availabilityText})`
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
              console.error(`Bark channel ${channel.id} is missing device key`)
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
