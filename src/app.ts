import 'dotenv/config'
import express from 'express'
import { Client, GatewayIntentBits } from 'discord.js'

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
})

client.on('ready', () => {
  console.log('Bot is ready')
})

client.on('messageCreate', async (message) => {
  if (message.content === 'ping') {
    message.reply({
      content: 'pong',
    })
  } else if (message.content === 'quote') {
    const res = 'This should be a quote fetched from an API'
    const quote = res

    message.reply({
      content: quote,
    })
  }
})

client.login(process.env.DISCORD_BOT_ID)

export default function createApp() {
  const app = express()

  return app
}
