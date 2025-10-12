import type { PickupMessageRecommendations } from './types/pickupMessageRecommendations'
import type { ProductLocatorMeta } from './types/productLocatorMeta'

export const mappingProductLocatorMeta = (data: ProductLocatorMeta) => {
  const { dimensionsVariations, prices, imageDictionary } = data

  const dimensionsColorMap = new Map<string, string>(
    dimensionsVariations.dimensionColor.map((color) => [
      color.key,
      color.value,
    ]),
  )

  const _dimensionsCapacityMap = new Map<string, string>(
    dimensionsVariations.dimensionCapacity.map((capacity) => [
      capacity.key,
      capacity.value || '',
    ]),
  )

  const dimensionsScreensizeMap = new Map<string, string>(
    dimensionsVariations.dimensionScreensize?.map((screensize) => [
      screensize.key,
      screensize.value || '',
    ]),
  )

  const carrierModelMap = new Map<string, string>(
    (dimensionsVariations.carrierModel || []).map((carrier) => [
      carrier.key,
      carrier.value || '',
    ]),
  )

  const imageDictionaryMap = new Map<string, string>(
    Object.entries(imageDictionary).map(([key, value]) => [
      key,
      value.sources[0].srcSet,
    ]),
  )

  const pricesMap = new Map<string, string>(
    Object.entries(prices).map(([key, value]) => [key, value.fullPrice]),
  )

  const products = data.products.map((product) => ({
    title: product.productTitle,
    basePartNumber: product.basePartNumber,
    partNumber: product.partNumber,
    imageUrl: imageDictionaryMap.get(product.image) || null,
    imageKey: product.image,
    capacity: product.dimensionCapacity
      ? product.dimensionCapacity.toUpperCase()
      : null,
    capacityKey: product.dimensionCapacity || null,
    screenSize:
      dimensionsScreensizeMap.get(product.dimensionScreensize) || null,
    screenSizeKey: product.dimensionScreensize || null,
    color: dimensionsColorMap.get(product.dimensionColor) || null,
    colorKey: product.dimensionColor || null,
    carrierModel: carrierModelMap.get(product.carrierModel) || null,
    carrierModelKey: product.carrierModel || null,
    price: pricesMap.get(product.price) || null,
    url: product.productLink,
  }))

  return products
}

export const processPickupMessageAvailabilityByPartNumber = (
  partNumber: string,
  data: PickupMessageRecommendations['body']['PickupMessage'],
) => {
  const { stores } = data

  if (!stores) {
    return []
  }

  const storeList = stores.map((store) => {
    const partAvailability = store.partsAvailability[partNumber]

    if (!partAvailability) {
      return {
        storeName: store.storeName,
        storeNumber: store.storeNumber,
        availabilityText: 'N/A',
        isAvailable: false,
      }
    }

    return {
      storeName: store.storeName,
      storeNumber: store.storeNumber,
      availabilityText: partAvailability.pickupSearchQuote,
      isAvailable: partAvailability.pickupDisplay === 'available',
    }
  })

  return storeList
}
