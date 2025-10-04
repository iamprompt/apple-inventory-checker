import { type Browser, chromium } from 'playwright'
import { env } from '../../config'

let cachedBrowser: Browser

const launchBrowser = async () => {
  if (cachedBrowser) {
    return cachedBrowser
  }

  cachedBrowser = await chromium.launch({
    headless: env.HEADLESS_BROWSER,
    args: [
      // cache
      '--disable-dev-profile',
      '--aggressive-cache-discard',
      '--disable-cache',
      '--disable-application-cache',
      '--disable-offline-load-stale-cache',
      '--disable-gpu-shader-disk-cache',
      '--media-cache-size=0',
      '--disk-cache-size=0',
      // performance
      '--disable-infobars',
      '--no-sandbox',
      '--disable-gpu',
      '--disable-setuid-sandbox',
      '--no-zygote',
      '--disable-web-security',
      '--disable-extensions',
      '--disable-plugins',
      '--headless',
      '--disable-breakpad',
      '--disable-client-side-phishing-detection',
      '--disable-sync',
      '--disable-translate',
      '--no-experiments',
      '--disable-default-apps',
      '--mute-audio',
      '--no-default-browser-check',
      '--disable-background-timer-throttling',
      '--disable-backgrounding-occluded-windows',
      '--disable-notifications',
      '--disable-background-networking',
      '--disable-component-update',
      '--disable-domain-reliability',
      '--autoplay-policy=user-gesture-required',
      '--disable-component-extensions-with-background-pages',
    ],
  })

  return cachedBrowser
}

export const getNewAppleCookies = async (): Promise<string[] | null> => {
  try {
    const browser = await launchBrowser()

    console.log('Fetching Apple cookies using Playwright...')
    const context = await browser.newContext({
      userAgent:
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36',
      extraHTTPHeaders: {
        'Accept-Language': 'en-US,en;q=0.9,th-TH;q=0.8,th;q=0.7',
        'Cache-Control': 'no-cache',
        Pragma: 'no-cache',
        'sec-ch-ua':
          '"Chromium";v="140", "Not=A?Brand";v="24", "Google Chrome";v="140"',
      },
    })

    const page = await context.newPage()

    page.on('response', (response) => {
      if (response.url().includes('fulfillment-messages')) {
        console.log('Response:', response.status(), response.url())
      }
    })

    // Remove the webdriver property to avoid detection
    await page.addInitScript(
      'delete Object.getPrototypeOf(navigator).webdriver',
    )

    console.log('Navigating to Apple website to retrieve cookies...')
    await page.goto(
      'https://www.apple.com/th/shop/buy-iphone/iphone-17-pro/%E0%B8%88%E0%B8%AD%E0%B8%A0%E0%B8%B2%E0%B8%9E%E0%B8%82%E0%B8%99%E0%B8%B2%E0%B8%94-6.9-%E0%B8%99%E0%B8%B4%E0%B9%89%E0%B8%A7-256gb-%E0%B8%99%E0%B9%89%E0%B8%B3%E0%B9%80%E0%B8%87%E0%B8%B4%E0%B8%99%E0%B9%80%E0%B8%82%E0%B9%89%E0%B8%A1',
    )

    const maxRetries = 3
    let attempt = 0
    let fulfillmentSuccess = false
    while (attempt < maxRetries) {
      console.log(`Waiting for fulfillment-messages... Attempt ${attempt + 1}`)

      await page.waitForLoadState('networkidle')
      const fulfillmentResponse = await page.waitForResponse((response) =>
        response.url().includes('fulfillment-messages'),
      )

      if (fulfillmentResponse && fulfillmentResponse.status() === 200) {
        fulfillmentSuccess = true
        console.log('Successfully fetched fulfillment-messages.')
        break
      }
      attempt++
      if (attempt === maxRetries) {
        console.warn(
          'Max retries reached. Proceeding with whatever cookies have been captured.',
        )
      }

      console.log(
        `Retrying to fetch fulfillment-messages... Attempt ${attempt + 1}`,
      )
      await page.reload()
    }

    // Extract cookies
    console.log('Extracting cookies...')
    const cookies = await context.cookies()
    const cookieArrays = cookies.map(
      (cookie) => `${cookie.name}=${cookie.value}`,
    )

    await context.close()
    return fulfillmentSuccess ? cookieArrays : null
  } catch (error) {
    console.error('Error fetching Apple cookies:', error)
    return []
  }
}
