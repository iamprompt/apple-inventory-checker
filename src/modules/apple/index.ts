import ky from 'ky'
import type { ProductLocatorMetaResponse } from './types/productLocatorMeta'

export const getProductLocatorMeta = async (
  productFamily: string,
  locale: string = 'th',
) => {
  const url = `https://www.apple.com/${locale}/shop/product-locator-meta`

  try {
    const response = await ky.get<ProductLocatorMetaResponse>(url, {
      searchParams: {
        family: productFamily,
      },
    })

    const json = await response.json()

    const { body } = json

    return body.productLocatorOverlayData.productLocatorMeta
  } catch (error) {
    console.error('Error fetching product locator meta:', error)
    return null
  }
}

export const getProductAvailability = async (
  partNumbers: string[],
  store: string = 'R646',
) => {
  const url = 'https://www.apple.com/shop/retail/pickup-message'

  try {
    const response = await ky.get(url, {
      searchParams: {
        parts: partNumbers.join(','),
        store: store,
      },
    })

    return await response.json()
  } catch (error) {
    console.error('Error fetching product availability:', error)
    return null
  }
}
