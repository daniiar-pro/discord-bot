import { Router } from 'express'
import buildRepository from './repository'
import { jsonRoute } from '../../utils/middleware'
import { Database } from '../../database'
import { z } from 'zod'
import * as schema from './schema'
import NotFound from '../../utils/errors/NotFound'
import BadRequest from '../../utils/errors/BadRequest'

export default (db: Database) => {
  const routes = Router()

  const sprint = buildRepository(db)

  routes.get(
    '/',
    jsonRoute(async (req, res) => {
      const sprints = await sprint.getAllSprint()

      if (!sprints || sprints.length === 0) {
        throw new NotFound('No sprints found.')
      }

      res.status(200).json(sprints)
    })
  )

  routes.get(
    '/:id',
    jsonRoute(async (req, res) => {
      const sprintId = Number(req.params.id)

      if (isNaN(sprintId)) {
        throw new BadRequest('Invalid sprint ID.')
      }

      const selectedSprint = await sprint.getSprintById(sprintId)

      if (!selectedSprint) {
        throw new NotFound(`Sprint with ID ${sprintId} not found.`)
      }

      res.status(200).json(selectedSprint)
    })
  )

  routes.post(
    '/',
    jsonRoute(async (req, res) => {
      try {
        const bodyInsert = schema.parseInsertable(req.body)

        const newCreatedSprint = await sprint.addNewSprint({
          sprintCode: bodyInsert.sprintCode,
          sprintTitle: bodyInsert.sprintTitle,
        })

        if (!newCreatedSprint) {
          throw new Error('Failed to create a new sprint.')
        }

        res.status(201).json(newCreatedSprint)
      } catch (validationError) {
        if (validationError instanceof z.ZodError) {
          throw new BadRequest('Invalid input data.')
        }
        throw validationError
      }
    })
  )

  routes.patch(
    '/:id',
    jsonRoute(async (req, res) => {
      const sprintId = Number(req.params.id)

      if (isNaN(sprintId)) {
        throw new BadRequest('Invalid sprint ID.')
      }

      try {
        const bodyUpdate = schema.parseUpdateable(req.body)

        const updatedSprint = await sprint.updateSprint(
          {
            sprintCode: bodyUpdate.sprintCode,
            sprintTitle: bodyUpdate.sprintTitle,
          },
          sprintId
        )

        if (!updatedSprint) {
          throw new NotFound(`Sprint with ID ${sprintId} not found.`)
        }

        res.status(200).json(updatedSprint)
      } catch (validationError) {
        if (validationError instanceof z.ZodError) {
          throw new BadRequest('Invalid input data.')
        }
        throw validationError
      }
    })
  )

  routes.delete(
    '/delete/:id',
    jsonRoute(async (req, res) => {
      const sprintId = Number(req.params.id)

      if (isNaN(sprintId)) {
        throw new BadRequest('Invalid sprint ID.')
      }

      try {
        const deletedSprint =  sprint.deleteSprint(sprintId)

        if (!deletedSprint) {
          throw new NotFound(`Sprint with ID ${sprintId} not found.`)
        }

        res.status(200).json({
          message: `Sprint with ID ${sprintId} has been deleted successfully!`,
          data: deletedSprint,
        })
      } catch (error) {
        if (error instanceof BadRequest || error instanceof NotFound) {
          res.status(error.status).json({ error: error.message })
        } else {
          res.status(500).json({ error: 'Internal Server Error' })
        }
      }
    })
  )

  return routes
}
