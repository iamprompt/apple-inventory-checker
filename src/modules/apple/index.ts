import ky, { HTTPError } from 'ky'
import type { FulfillmentResponse } from './types/fulfillment'
import type { PickupMessageRecommendations } from './types/pickupMessageRecommendations'
import type { ProductLocatorMetaResponse } from './types/productLocatorMeta'

export const getProductLocatorMeta = async (
  locale: string = 'th',
  productFamily: string,
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
    // console.error('Error fetching product locator meta:', error)
    return null
  }
}

export const getProductAvailability = async (
  locale: string = 'th',
  partNumbers: string[],
  { cookies }: { cookies?: string[] } = {},
) => {
  try {
    console.log(
      `Fetching availability for locale: ${locale}, parts: ${partNumbers.join(', ')}`,
    )

    const response = await ky.get<FulfillmentResponse>(
      getFulfillmentUrl(locale, partNumbers),
      {
        headers: {
          'user-agent':
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36',
          Cookie: cookies?.join('; '),
        },
        cache: 'no-cache',
        retry: 3,
        timeout: 10000,
      },
    )

    const json = await response.json()

    return json.body.content
  } catch (error) {
    if (error instanceof HTTPError) {
      if (error.response.status === 541) {
        console.error('Received HTTP 541 error - likely blocked by Apple')
        return 541
      }
    }
    return null
  }
}

export const getAvailabilityMessage = async (
  locale: string = 'th',
  partNumbers: string[],
) => {
  try {
    const response = await ky.get(
      getAvailabilityMessageUrl(locale, partNumbers),
    )

    const json = await response.json()

    return json
  } catch (error) {
    console.error('Error fetching product availability:', error)
    return null
  }
}

export const getFulfillmentUrl = (
  locale: string,
  partNumbers: string[],
  {
    location = '10600',
    store,
    little = false,
  }: { location?: string; store?: string; little?: boolean } = {},
) => {
  const url = new URL(
    `https://www.apple.com/${locale}/shop/fulfillment-messages`,
  )

  if (Array.isArray(partNumbers)) {
    partNumbers.forEach((partNumber, index) => {
      url.searchParams.append(`parts.${index}`, partNumber)
    })
  } else {
    url.searchParams.set('parts.0', partNumbers)
  }

  url.searchParams.set('location', location)
  url.searchParams.set('postalCode', location)

  if (store) {
    url.searchParams.set('store', store)
  }

  if (little) {
    url.searchParams.set('little', 'true')
  }

  url.searchParams.set('mts.0', 'regular')
  // url.searchParams.set('mts.1', 'sticky')

  return url.toString()
}

export const getAvailabilityMessageUrl = (
  locale: string,
  partNumbers: string[],
) => {
  const url = new URL(
    `https://www.apple.com/${locale}/shop/sba/availability-message`,
  )

  if (Array.isArray(partNumbers)) {
    partNumbers.forEach((partNumber, index) => {
      url.searchParams.append(`parts.${index}`, partNumber)
    })
  } else {
    url.searchParams.set('parts.0', partNumbers)
  }

  return url.toString()
}

export const getPickupMessageAvailability = async (
  locale: string = 'th',
  partNumber: string,
  store: string = 'R733' /* Apple Central World */,
) => {
  try {
    console.log(
      `Fetching pickup message availability for locale: ${locale}, part: ${partNumber}, store: ${store}`,
    )

    const response = await ky.get<PickupMessageRecommendations>(
      `https://www.apple.com/${locale}/shop/pickup-message-recommendations`,
      {
        searchParams: new URLSearchParams({
          product: partNumber,
          store,
        }),
        cache: 'no-cache',
        retry: {
          limit: 3,
          delay: (attempt) => Math.min(1000 * 2 ** attempt, 10000),
        },
        timeout: 3000,
        headers: {
          'sec-ch-ua':
            '"Google Chrome";v="141", "Not?A_Brand";v="8", "Chromium";v="141"',
          'sec-ch-ua-mobile': '?0',
          'sec-ch-ua-platform': '"macOS"',
          'sec-fetch-dest': 'document',
          'sec-fetch-mode': 'navigate',
          'sec-fetch-site': 'none',
          'sec-fetch-user': '?1',
          'User-Agent':
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36',
        },
      },
    )

    // https://www.apple.com/th/shop/pickup-message-recommendations
    const json = await response.json()

    await new Promise((resolve) => setTimeout(resolve, 500)) // wait for 200 ms

    return json.body.PickupMessage
  } catch (error) {
    if (error instanceof HTTPError) {
      const json = await error.response.json()
      const status = error.response.status
      console.error(
        `HTTP Error ${status} fetching pickup message availability for locale: ${locale}, part: ${partNumber}, store: ${store}`,
        json,
      )
    }
    return null
  }
}
