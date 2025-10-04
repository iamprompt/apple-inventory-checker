import { getNewAppleCookies } from './crawler'

let cachedCookies: string[] | null = null

export const getFulfillmentCookies = async (): Promise<string[] | null> => {
  console.log('Retrieving cached Apple cookies...')
  if (cachedCookies) {
    console.log('Using cached Apple cookies.')
    return cachedCookies
  }
  console.log('No cached cookies found, fetching new ones...')
  const newCookies = await getNewAppleCookies()
  if (newCookies) {
    cachedCookies = newCookies
    console.log('New Apple cookies fetched and cached.')
  } else {
    console.warn('Failed to fetch new Apple cookies.')
  }
  return newCookies
}

export const clearCachedCookies = () => {
  cachedCookies = null
  console.log('Cleared cached Apple cookies.')
}
