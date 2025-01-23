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
    .insertInto('sprint')
    .values([
      { id: 1, sprintCode: 'WD-1.1', sprintTitle: 'Web Dev Basics' },
      { id: 2, sprintCode: 'WD-2.2', sprintTitle: 'Advanced JavaScript' },
    ])
    .execute()
})

afterEach(async () => {
  await db.destroy()
})

describe('Sprint Routes', () => {
  describe('GET /sprint', () => {
    it('should return all sprints', async () => {
      const response = await supertest(app).get('/sprint')
      expect(response.status).toBe(200)
      expect(response.body).toEqual([
        { id: 1, sprintCode: 'WD-1.1', sprintTitle: 'Web Dev Basics' },
        { id: 2, sprintCode: 'WD-2.2', sprintTitle: 'Advanced JavaScript' },
      ])
    })

    it('should return 404 if no sprints exist', async () => {
      await db.deleteFrom('sprint').execute()

      const response = await supertest(app).get('/sprint')
      expect(response.status).toBe(404)
    })
  })

  describe('GET /sprint/:id', () => {
    it('should return a sprint by ID', async () => {
      const response = await supertest(app).get('/sprint/1')
      expect(response.status).toBe(200)
      expect(response.body).toEqual({
        id: 1,
        sprintCode: 'WD-1.1',
        sprintTitle: 'Web Dev Basics',
      })
    })

    it('should return 400 if the sprint ID is invalid', async () => {
      const response = await supertest(app).get('/sprint/abc')
      expect(response.status).toBe(400)
    })

    it('should return 404 if the sprint does not exist', async () => {
      const response = await supertest(app).get('/sprint/999')
      expect(response.status).toBe(404)
    })
  })

  describe('POST /sprint', () => {
    it('should create a new sprint', async () => {
      const response = await supertest(app)
        .post('/sprint')
        .send({ sprintCode: 'WD-3.3', sprintTitle: 'Node.js Fundamentals' })
      expect(response.status).toBe(201)
      expect(response.body).toMatchObject({
        id: expect.any(Number),
        sprintCode: 'WD-3.3',
        sprintTitle: 'Node.js Fundamentals',
      })

      const sprints = await db.selectFrom('sprint').selectAll().execute()
      expect(sprints.length).toBe(3)
    })

    it('should return 400 if input data is invalid', async () => {
      const response = await supertest(app)
        .post('/sprint')
        .send({ sprintTitle: '' })
      expect(response.status).toBe(400)
    })
  })

  describe('PATCH /sprint/:id', () => {
    it('should update an existing sprint', async () => {
      const response = await supertest(app)
        .patch('/sprint/1')
        .send({ sprintTitle: 'Updated Title' })
      expect(response.status).toBe(200)
      expect(response.body).toMatchObject({
        id: 1,
        sprintCode: 'WD-1.1',
        sprintTitle: 'Updated Title',
      })

      const updated = await db
        .selectFrom('sprint')
        .selectAll()
        .where('id', '=', 1)
        .executeTakeFirst()
      expect(updated?.sprintTitle).toBe('Updated Title')
    })

    it('should return 400 if sprint ID is invalid', async () => {
      const response = await supertest(app).patch('/sprint/abc')
      expect(response.status).toBe(400)
    })

    it('should return 404 if sprint is not found', async () => {
      const response = await supertest(app)
        .patch('/sprint/999')
        .send({ sprintTitle: 'Does not exist' })
      expect(response.status).toBe(404)
    })
  })

  describe('DELETE /sprint/delete/:id', () => {
    it('should delete an existing sprint', async () => {
      const response = await supertest(app).delete('/sprint/delete/1')
      expect(response.status).toBe(200)

      const sprints = await db.selectFrom('sprint').selectAll().execute()
      expect(sprints.length).toBe(1)
      expect(sprints[0].id).toBe(2)
    })

    it('should return 400 if sprint ID is invalid', async () => {
      const response = await supertest(app).delete('/sprint/delete/abc')
      expect(response.status).toBe(400)
    })
  })
})
