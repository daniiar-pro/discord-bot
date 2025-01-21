import { Router } from 'express'
import buildRepository from './repository'
import { jsonRoute } from '../../utils/middleware'
import { Database } from '../../database'

export default (db: Database) => {
  const routes = Router()

  const templates = buildRepository(db)

  routes.get(
    '/',
    jsonRoute(async (req, res) => {
      const getTemplate = await templates.getTemplate()

      res.status(200)
      res.json(getTemplate)
      return
    })
  )

  routes.post(
    '/',
    jsonRoute(async (req, res) => {
      const newMessageTemplate = req.body.template

      const newCreatedTemplate =
        await templates.createNewTemplate(newMessageTemplate)

      res.status(200)
      res.json(newCreatedTemplate)
    })
  )

  routes.patch(
    '/:id',
    jsonRoute(async (req, res) => {
      const templateId = req.params.id
      const newTemplateValue = req.body.template

      const updatedTemplate = await templates.updateTemplate(
        newTemplateValue,
        templateId
      )

      res.status(200)
      res.json(updatedTemplate)
      return
    })
  )

  routes.delete(
    '/delete/:id',
    jsonRoute(async (req, res) => {
      const templateId = req.params.id

      const deletedTemplate = templates.deleteTemplate(templateId)

      res.status(200).json({
        message: `Template with id ${templateId} has been deleted successfully!`,
        data: deletedTemplate,
      })

      return
    })
  )

  return routes
}
