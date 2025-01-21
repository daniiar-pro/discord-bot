import 'dotenv/config'
import { Router } from 'express'
import type { Database } from '../../database'
import buildRepository from './repository'
import { jsonRoute } from '../../utils/middleware'
import { getMessageTemplate } from '../templates/repository'
import buildTemplateRepo from '../templates/repository'
import buildSprintRepo from '../sprints/repository'
import axios from 'axios'
import getGifs from './fetchGifs/getGifs'

const { DISCORD_WEBHOOK_URL } = process.env

export default (db: Database) => {
  const messages = buildRepository(db)
  const templates = buildTemplateRepo(db)
  const sprint = buildSprintRepo(db)

  const router = Router()

  // Get all messages ( GET: /messages)
  router.get(
    '/',
    jsonRoute(async (req, res) => {
      const congratsMessages = await messages.getAllMessages()
      res.status(200)
      res.json(congratsMessages)
      return
    })
  )

  // GET  messages for a specific user (GET: /messages?username=Daniiar)
  router.get(
    '/username/:userName',
    jsonRoute(async (req, res) => {
      const userName = req.params.userName
      const messagesForUser = await messages.getMessagesForUser(userName)
      res.status(200)
      res.json(messagesForUser)
      return
    })
  )

  // GET messages for a specific sprint (GET: /messages?sprint=WD-1.1)

  router.get(
    '/sprint/:sprintCode',
    jsonRoute(async (req, res) => {
      const sprintCode = req.params.sprintCode
      const messagesForSprint = await messages.getMessagesForSprint(sprintCode)
      console.log('sprintCode: ', sprintCode)
      console.log('typeof sprint code: ', typeof sprintCode)
      res.status(200)
      res.json(messagesForSprint)
      return
    })
  )

  router.post(
    '/',
    jsonRoute(async (req, res) => {
      const randomNumber = Math.floor(Math.random() * 21)
      const randomCongratsMessages = await messages.getAllMessages()

      try {
        const userName = req.body.username
        const sprintCode = req.body.sprintCode
        const sprintTitle = await sprint.assignSprintTitle(sprintCode)

        const congratsMessage = randomCongratsMessages[randomNumber].message

        const addNewCongrats = await messages.createCongratsMessage(
          userName,
          sprintCode,
          sprintTitle,
          congratsMessage
        )

        const gifUrl = await getGifs()

        const templateId = 1
        await templates.getTemplateById(templateId)

        const template = await getMessageTemplate()

        const renderCongratsMessage = template
          .replace('${userName}', userName)
          .replace('${sprintTitle}', sprintTitle)

        await axios.post(DISCORD_WEBHOOK_URL as string, {
          content: `${renderCongratsMessage}\n ${congratsMessage}`,
          embeds: [
            {
              image: {
                url: gifUrl,
              },
            },
          ],
        })

        res.status(200)
        return addNewCongrats
      } catch (error) {
        console.error('Error handling POST request: ', error)
        res.status(500).json({ error: 'Internal Server Error' })
      }
    })
  )

  return router
}
