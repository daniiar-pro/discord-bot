import 'dotenv/config'
import express from 'express'
import { type Database } from './database'
import messages from './modules/messages/controller'

export default function createApp(db: Database) {
  const app = express()

  app.use(express.json())

  app.use('/messages', messages(db))

  return app
}
