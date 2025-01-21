import { Router } from 'express'
import buildRepository from './repository'
import { jsonRoute } from '../../utils/middleware'
import { Database } from '../../database'

export default (db: Database) => {
  const routes = Router()

  const sprint = buildRepository(db)

  routes.get(
    '/',
    jsonRoute(async (req, res) => {
      const getTemplate = await sprint.getAllSprint()

      res.status(200)
      res.json(getTemplate)
      return
    })
  )

  routes.get(
    '/:id',
    jsonRoute(async (req, res) => {
      const sprintId = req.params.id

      const selectedSprint = await sprint.getSprintById(sprintId)

      res.status(200)
      res.json(selectedSprint)
    })
  )


  routes.post(
    '/',
    jsonRoute(async (req, res) => {
      const newSprintTitle = req.body.sprintTitle
      const newSprintCode = req.body.sprintCode

      const newCreatedSprint = await sprint.addNewSprint(
        newSprintTitle,
        newSprintCode
      )

      res.status(200)
      res.json(newCreatedSprint)
    })
  )

  routes.patch(
    '/:id',
    jsonRoute(async (req, res) => {
      const updatedSprintTitle = req.body.sprintTitle
      const updatedSprintCode = req.body.sprintCode

      const sprintId = req.params.id

      const updatedSprint = await sprint.updateSprint(
        updatedSprintTitle,
        updatedSprintCode,
        sprintId
      )

      res.status(200)
      res.json(updatedSprint)
      return
    })
  )

  routes.delete(
    '/delete/:id',
    jsonRoute(async (req, res) => {
      const sprintId = req.params.id

      const deletedSprint = sprint.deleteSprint(sprintId)

      res.status(200).json({
        message: `Sprint with id ${sprintId} has been deleted successfully!`,
        data: deletedSprint,
      })

      return
    })
  )

  return routes
}
