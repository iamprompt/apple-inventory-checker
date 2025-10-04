import { serve } from '@hono/node-server'
import type { InferInsertModel } from 'drizzle-orm'
import { Hono } from 'hono'
import nodeCron from 'node-cron'
import { env } from './config'
import { db } from './database'
import { products } from './database/schema/products'
import { getProductLocatorMeta } from './modules/apple'
import { mappingProductLocatorMeta } from './modules/apple/helper'
import { scheduled } from './scheduled'
import type { App } from './types'

const app = new Hono<App>()

app.get('/', (c) => c.text('Hello! This is Apple Inventory Checker.'))

app.post('/products/add', async (c) => {
  const body = await c.req.json()

  const { product_family, locale } = body

  const res = await getProductLocatorMeta(locale, product_family)

  if (!res) {
    return c.json({ message: 'Failed to fetch product locator meta' }, 500)
  }

  const prods = mappingProductLocatorMeta(res)

  for (const prod of prods) {
    const updatedProduct: InferInsertModel<typeof products> = {
      locale,
      basePartNumber: prod.basePartNumber,
      partNumber: prod.partNumber,
      capacity: prod.capacity || 'N/A',
      capacityKey: prod.capacityKey || null,
      screenSize: prod.screenSize || 'N/A',
      screenSizeKey: prod.screenSizeKey || null,
      color: prod.color || 'N/A',
      colorKey: prod.colorKey || null,
      carrierModel: prod.carrierModel || null,
      carrierModelKey: prod.carrierModelKey || null,
      imageKey: prod.imageKey || null,
      imageUrl: prod.imageUrl || null,
      price: prod.price || 'N/A',
      name: prod.title,
      url: prod.url || null,
    }

    await db
      .insert(products)
      .values(updatedProduct)
      .onConflictDoUpdate({
        target: [products.locale, products.partNumber],
        set: updatedProduct,
      })
  }

  return c.json({ message: 'Add product endpoint' })
})

app.post('/update', async (c) => {
  await scheduled()
  return c.json({ message: 'Update endpoint' })
})

if (env.CRON_SCHEDULE) {
  nodeCron.schedule('* * * * *', scheduled)
}

const server = serve(app, (info) => {
  console.log(`Server running on http://${info.address}:${info.port}`)
})

// graceful shutdown
process.on('SIGINT', () => {
  server.close()
  process.exit(0)
})
process.on('SIGTERM', () => {
  server.close((err) => {
    if (err) {
      console.error(err)
      process.exit(1)
    }
    process.exit(0)
  })
})
