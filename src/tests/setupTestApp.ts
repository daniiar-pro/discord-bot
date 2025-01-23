import express from 'express'
import type { Kysely } from 'kysely'
import messagesRouter from '../modules/messages/controller'
import templatesRouter from '../modules/templates/controller'
import sprintRouter from '../modules/sprints/controller'
import type { DB } from '../database'

export const setupTestApp = (db: Kysely<DB>) => {
  const app = express()

  app.use(express.json())
  app.use('/messages', messagesRouter(db))
  app.use('/templates', templatesRouter(db))
  app.use('/sprint', sprintRouter(db))
  return app
}
