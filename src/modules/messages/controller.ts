import { Router } from 'express'
import type { Database } from '../../database'
import buildRepository from './repository'
import { jsonRoute } from '../../utils/middleware'

export default (db: Database) => {
  const messages = buildRepository(db)
  const router = Router()

  router.get(
    '/',
    jsonRoute(async (req, res) => {
      const congratsMessages = await messages.getAllMessages()
      res.status(200)
      res.json(congratsMessages)
      return
    })
  )

  return router
}
