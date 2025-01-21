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
import * as schema from './schema'
import NotFound from '../../utils/errors/NotFound'
import { StatusCodes } from 'http-status-codes'
import BadRequest from '../../utils/errors/BadRequest'

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

      if (!congratsMessages || congratsMessages.length === 0) {
        throw new NotFound('No messages found')
      }
      res.status(200).json(congratsMessages)
    })
  )

  // GET  messages for a specific user (GET: /messages?username=Daniiar)
  router.get(
    '/username/:userName',
    jsonRoute(async (req, res) => {
      const userName = req.params.userName

      if (!userName) {
        throw new BadRequest('User name is required')
      }

      const messagesForUser = await messages.getMessagesForUser(userName)

      if (!messagesForUser || messagesForUser.length === 0) {
        throw new NotFound(`No messages found for the user: ${userName}`)
      }
      res.status(200).json(messagesForUser)
    })
  )

  // GET messages for a specific sprint (GET: /messages?sprint=WD-1.1)

  router.get(
    '/sprint/:sprintCode',
    jsonRoute(async (req, res) => {
      const sprintCode = req.params.sprintCode

      if (!sprintCode) {
        throw new BadRequest('Sprint code is required')
      }
      const messagesForSprint = await messages.getMessagesForSprint(sprintCode)
      if (!messagesForSprint || messagesForSprint.length === 0) {
        throw new NotFound(
          `No messages found for the sprint code: ${sprintCode}`
        )
      }
      res.status(200).json(messagesForSprint)
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

        if (!userName || !sprintCode) {
          throw new BadRequest('Both username and sprintCode are required')
        }

        const sprintTitle = await sprint.assignSprintTitle(sprintCode)

        if (!sprintTitle) {
          throw new NotFound(
            `No sprint title found for sprint code: ${sprintCode}`
          )
        }

        const congratsMessage = randomCongratsMessages[randomNumber]?.message

        if (!congratsMessage) {
          throw new NotFound('No random congratulatory message available')
        }

        const body = schema.parseInsertable({
          congratsMessage,
          sprintCode,
          sprintTitle,
          userName,
        })

        const addNewCongrats = await messages.createCongratsMessage(body)

        const gifUrl = await getGifs('celebration')

        const templateId = 1
        await templates.getTemplateById(templateId)

        const template = await getMessageTemplate()

        if (!template) {
          throw new NotFound('Template not found')
        }

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

        res.status(StatusCodes.OK).json(addNewCongrats)
      } catch (error) {
        console.error('Error handling POST request: ', error)
        if (error instanceof BadRequest || error instanceof NotFound) {
          res.status(error.status).json({ error: error.message })
        } else {
          res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json({ error: 'Internal Server Error' })
        }
      }
    })
  )

  return router
}
