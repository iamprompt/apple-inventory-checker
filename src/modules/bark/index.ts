import ky from 'ky'

type BarkNotificationOptions = {
  title: string
  body: string
  url?: string
  id: string
  device_keys: string[]
  level?: 'active' | 'passive' | 'critical'
  volume?: number
}

export const sendBarkNotification = async ({
  title,
  body,
  url,
  id,
  device_keys,
  level = 'active',
  volume = 5,
}: BarkNotificationOptions) => {
  await ky.post('https://api.day.app/push', {
    json: {
      title,
      body,
      url,
      id,
      device_keys,
      level,
      volume,
    },
  })
}
