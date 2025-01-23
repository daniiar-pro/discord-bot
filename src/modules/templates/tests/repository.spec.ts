import createTestDatabase from '../../../tests/utils/createTestDatabase'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import buildRepository from '../repository'

let db: Awaited<ReturnType<typeof createTestDatabase>>
let repository: ReturnType<typeof buildRepository>

beforeEach(async () => {
  db = await createTestDatabase()
  repository = buildRepository(db)

  await db
    .insertInto('templates')
    .values([
      { id: 1, template: '${userName} has just completed ${sprintTitle}' },
      { id: 2, template: '${userName} finished ${sprintCode}' },
    ])
    .execute()
})

afterEach(async () => {
  await db.destroy()
})

describe('Repository Tests', () => {
  describe('getTemplate', () => {
    it('should return all templates', async () => {
      const templates = await repository.getTemplate()
      expect(templates).toEqual([
        { id: 1, template: '${userName} has just completed ${sprintTitle}' },
        { id: 2, template: '${userName} finished ${sprintCode}' },
      ])
    })

    it('should return an empty array if no templates exist', async () => {
      await db.deleteFrom('templates').execute()
      const templates = await repository.getTemplate()
      expect(templates).toEqual([])
    })
  })

  describe('getTemplateById', () => {
    it('should return a template by ID', async () => {
      const template = await repository.getTemplateById(1)
      expect(template).toEqual({
        id: 1,
        template: '${userName} has just completed ${sprintTitle}',
      })
    })

    it('should return undefined if the template does not exist', async () => {
      const template = await repository.getTemplateById(999)
      expect(template).toBeUndefined()
    })
  })

  describe('createNewTemplate', () => {
    it('should create a new template', async () => {
      const newTemplate = await repository.createNewTemplate({
        template: '${userName} started ${sprintName}',
      })

      expect(newTemplate).toMatchObject({
        id: expect.any(Number),
        template: '${userName} started ${sprintName}',
      })

      const templates = await db.selectFrom('templates').selectAll().execute()
      expect(templates.length).toBe(3)
    })
  })

  describe('updateTemplate', () => {
    it('should update an existing template by ID', async () => {
      const updatedTemplate = await repository.updateTemplate(1, {
        template: '${userName} successfully completed ${newSprintTitle}',
      })

      expect(updatedTemplate).toEqual({
        id: 1,
        template: '${userName} successfully completed ${newSprintTitle}',
      })

      const template = await db
        .selectFrom('templates')
        .selectAll()
        .where('id', '=', 1)
        .executeTakeFirst()

      expect(template).toEqual({
        id: 1,
        template: '${userName} successfully completed ${newSprintTitle}',
      })
    })

    it('should return undefined if the template ID does not exist', async () => {
      const updatedTemplate = await repository.updateTemplate(999, {
        template: '${userName} successfully completed ${newSprintTitle}',
      })
      expect(updatedTemplate).toBeUndefined()
    })
  })

  describe('deleteTemplate', () => {
    it('should delete a template by ID', async () => {
      const deletedTemplate = await repository.deleteTemplate(1)

      expect(deletedTemplate).toEqual({
        id: 1,
        template: '${userName} has just completed ${sprintTitle}',
      })

      const templates = await db.selectFrom('templates').selectAll().execute()
      expect(templates.length).toBe(1)
      expect(templates[0]).toEqual({
        id: 2,
        template: '${userName} finished ${sprintCode}',
      })
    })

    it('should return undefined if the template ID does not exist', async () => {
      const deletedTemplate = await repository.deleteTemplate(999)
      expect(deletedTemplate).toBeUndefined()
    })
  })
})
