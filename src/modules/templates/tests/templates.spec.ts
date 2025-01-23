import createTestDatabase from '../../../tests/utils/createTestDatabase'
import { setupTestApp } from '../../../tests/setupTestApp'
import supertest from 'supertest'
import { beforeEach, afterEach, describe, it, expect } from 'vitest'

let db: Awaited<ReturnType<typeof createTestDatabase>>
let app: ReturnType<typeof setupTestApp>

beforeEach(async () => {
  db = await createTestDatabase()
  app = setupTestApp(db)

  await db
    .insertInto('templates')
    .values([
      { id: 1, template: '${userName} has just completed  ${sprintTitle}' },
      { id: 2, template: '${userName} completed the task ${sprintTitle}' },
    ])
    .execute()
})

afterEach(async () => {
  await db.destroy()
})

describe('Templates', () => {
  it('should return all templates', async () => {
    const response = await supertest(app).get('/templates')
    expect(response.status).toBe(200)
    expect(response.body).toEqual([
      { id: 1, template: '${userName} has just completed  ${sprintTitle}' },
      { id: 2, template: '${userName} completed the task ${sprintTitle}' },
    ])
  })

  it('should return a template by ID', async () => {
    const response = await supertest(app).get('/templates/1')
    expect(response.status).toBe(200)
    expect(response.body).toEqual({
      id: 1,
      template: '${userName} has just completed  ${sprintTitle}',
    })
  })

  it('should return 404 if template not found', async () => {
    const response = await supertest(app).get('/templates/999')
    expect(response.status).toBe(404)
  })

  it('should create a new template', async () => {
    const response = await supertest(app)
      .post('/templates')
      .send({ template: '${userName} started ${sprintTitle}' })
    expect(response.status).toBe(200)
    expect(response.body.template).toBe('${userName} started ${sprintTitle}')
  })

  it('should update an existing template', async () => {
    const response = await supertest(app)
      .patch('/templates/1')
      .send({ template: '${userName} has completed ${newSprintTitle}' })
    expect(response.status).toBe(200)
    expect(response.body.template).toBe(
      '${userName} has completed ${newSprintTitle}'
    )
  })

  it('should delete a template', async () => {
    const response = await supertest(app).delete('/templates/delete/1')
    expect(response.status).toBe(200)
    expect(response.body.message).toBe(
      'Template with id 1 has been deleted successfully!'
    )
  })
})
