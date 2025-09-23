import { chromium } from 'playwright'

export const getAppleCookies = async (): Promise<string[]> => {
  try {
    const browser = await chromium.launch({
      headless: true,
    })
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

    // page.on('request', (request) => {
    //   // Log all requests to the console
    //   console.log('Request:', request.method(), request.url())
    // })

    // page.on('response', (response) => {
    //   // Log all responses to the console
    //   console.log(
    //     'Response:',
    //     response.status(),
    //     response.url(),
    //     response.headers(),
    //   )
    // })

    await context.clearCookies()

    // Remove the webdriver property to avoid detection
    await page.addInitScript(
      'delete Object.getPrototypeOf(navigator).webdriver',
    )

    await page.goto(
      'https://www.apple.com/th/shop/buy-iphone/iphone-17-pro/%E0%B8%88%E0%B8%AD%E0%B8%A0%E0%B8%B2%E0%B8%9E%E0%B8%82%E0%B8%99%E0%B8%B2%E0%B8%94-6.9-%E0%B8%99%E0%B8%B4%E0%B9%89%E0%B8%A7-256gb-%E0%B8%99%E0%B9%89%E0%B8%B3%E0%B9%80%E0%B8%87%E0%B8%B4%E0%B8%99%E0%B9%80%E0%B8%82%E0%B9%89%E0%B8%A1',
    )

    // Wait for the page to load completely
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(5000) // Wait for 0.5 seconds to ensure all cookies are set

    await page.reload()
    await page.waitForTimeout(3000) // Wait for 0.5 seconds to ensure all cookies are set

    // Extract cookies
    const cookies = await context.cookies()
    const cookieStrings = cookies.map(
      (cookie) => `${cookie.name}=${cookie.value}`,
    )

    await browser.close()
    return cookieStrings
  } catch (error) {
    console.error('Error fetching Apple cookies:', error)
    return []
  }
}
