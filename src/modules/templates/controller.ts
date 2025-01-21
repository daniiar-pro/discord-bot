import { Router } from 'express'
import buildRepository from './repository'
import { jsonRoute } from '../../utils/middleware'
import { Database } from '../../database'
import * as schema from './schema'
import NotFound from '../../utils/errors/NotFound'
import BadRequest from '../../utils/errors/BadRequest'

export default (db: Database) => {
  const routes = Router()

  const templates = buildRepository(db)

  routes.get(
    '/',
    jsonRoute(async (req, res) => {
      const getTemplate = await templates.getTemplate()

      if (!getTemplate) {
        throw new NotFound('No templates found')
      }
      res.status(200).json(getTemplate)
    })
  )

  routes.get(
    '/:id',
    jsonRoute(async (req, res) => {
      const templateId = Number(req.params.id)

      const getTemplateById = await templates.getTemplateById(templateId)

      if (!getTemplateById) {
        throw new NotFound(`No template found with id ${templateId}`)
      }

      res.status(200).json(getTemplateById)
    })
  )

  routes.post(
    '/',
    jsonRoute(async (req, res) => {
      try {
        let parsedData

        if (typeof req.body.template === 'string') {
          parsedData = schema.parseInsertable({ template: req.body.template })
        } else {
          parsedData = schema.parseInsertable(req.body.template)
        }

        const newCreatedTemplate = await templates.createNewTemplate(parsedData)

        if (!newCreatedTemplate) {
          throw new Error('Failed to create a new template.')
        }

        res.status(200).json(newCreatedTemplate)
      } catch (error) {
        console.error('Error handling POST request:', error)
        if (error instanceof BadRequest) {
          res.status(error.status).json({ error: error.message })
        } else {
          res.status(500).json({ error: 'Internal server error.' })
        }
      }
    })
  )

  routes.patch(
    '/:id',
    jsonRoute(async (req, res) => {
      const templateId = Number(req.params.id)

      if (isNaN(templateId)) {
        throw new BadRequest('Invalid template ID')
      }

      try {
        let parsedData

        if (!req.body.template) {
          throw new BadRequest('Template data is required')
        }

        if (typeof req.body.template === 'string') {
          parsedData = schema.parseInsertable({ template: req.body.template })
        } else {
          parsedData = schema.parseInsertable(req.body.template)
        }

        const newTemplateValue = schema.parseUpdateable(parsedData)
        const updatedTemplate = await templates.updateTemplate(
          templateId,
          newTemplateValue
        )

        if (!updatedTemplate) {
          throw new NotFound(`Template with id ${templateId} not found`)
        }

        res.status(200).json(updatedTemplate)
      } catch (error) {
        if (error instanceof BadRequest || error instanceof NotFound) {
          res.status(error.status).json({ error: error.message })
        } else {
          res.status(500).json({ error: 'Internal Server Error' })
        }
      }
    })
  )

  routes.delete(
    '/delete/:id',
    jsonRoute(async (req, res) => {
      const templateId = Number(req.params.id)

      if (isNaN(templateId)) {
        throw new BadRequest('Invalid template ID')
      }

      try {
        const deletedTemplate = templates.deleteTemplate(templateId)

        if (!deletedTemplate) {
          throw new NotFound(`Template with id ${templateId} not found`)
        }

        res.status(200).json({
          message: `Template with id ${templateId} has been deleted successfully!`,
          data: deletedTemplate,
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
