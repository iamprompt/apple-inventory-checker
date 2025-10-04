import ky, { HTTPError } from 'ky'
import { env } from '../../config'

export const sendMessage = async (
  chatId: string,
  text: string,
  additionalOptions: Record<string, any> = {},
) => {
  const url = `https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`

  try {
    const response = await ky.post(url, {
      json: {
        chat_id: chatId,
        text: escapeMarkdownV2(text),
        parse_mode: 'MarkdownV2',
        ...additionalOptions,
      },
      retry: 3,
      timeout: 10000,
    })

    const json = await response.json()

    await new Promise((resolve) => setTimeout(resolve, 1000)) // Rate limit handling

    return json
  } catch (error) {
    console.error('Error sending Telegram message:', error)
    if (error instanceof HTTPError) {
      const errorBody = await error.response.json()
      console.error('Telegram API error response:', errorBody)
    }
    return null
  }
}

export const escapeMarkdownV2 = (text: string) => {
  return text.replace(/([_[\]()~`>#+-=|{}.!])/g, '\\$1')
}
