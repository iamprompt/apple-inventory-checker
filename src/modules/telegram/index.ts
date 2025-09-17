import { env } from 'cloudflare:workers'
import ky from 'ky'

export const sendMessage = async (chatId: string, text: string) => {
  const url = `https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`

  try {
    const response = await ky.post(url, {
      json: {
        chat_id: chatId,
        text,
      },
    })

    const json = await response.json()

    return json
  } catch (error) {
    console.error('Error sending Telegram message:', error)
    return null
  }
}
