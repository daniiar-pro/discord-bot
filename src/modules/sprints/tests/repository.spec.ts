import createTestDatabase from '../../../tests/utils/createTestDatabase'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import buildRepository from '../repository'

let db: Awaited<ReturnType<typeof createTestDatabase>>
let repository: ReturnType<typeof buildRepository>

beforeEach(async () => {
  db = await createTestDatabase()

  repository = buildRepository(db)

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

describe('Sprint Repository', () => {
  describe('getAllSprint', () => {
    it('should return all sprints', async () => {
      const sprints = await repository.getAllSprint()

      expect(sprints).toEqual([
        { id: 1, sprintCode: 'WD-1.1', sprintTitle: 'Web Dev Basics' },
        { id: 2, sprintCode: 'WD-2.2', sprintTitle: 'Advanced JavaScript' },
      ])
    })

    it('should return an empty array if no sprints exist', async () => {
      await db.deleteFrom('sprint').execute()

      const sprints = await repository.getAllSprint()
      expect(sprints).toEqual([])
    })
  })

  describe('getSprintById', () => {
    it('should return the sprint matching the given ID', async () => {
      const sprint = await repository.getSprintById(1)
      expect(sprint).toEqual({
        id: 1,
        sprintCode: 'WD-1.1',
        sprintTitle: 'Web Dev Basics',
      })
    })

    it('should return undefined if no sprint matches the given ID', async () => {
      const sprint = await repository.getSprintById(999)
      expect(sprint).toBeUndefined()
    })
  })

  describe('assignSprintTitle', () => {
    it('should return the sprint title for a given sprint code', async () => {
      const title = await repository.assignSprintTitle('WD-2.2')
      expect(title).toBe('Advanced JavaScript')
    })

    it('should return "No such sprint Title" if the sprint code does not exist', async () => {
      const title = await repository.assignSprintTitle('INVALID-CODE')
      expect(title).toBe('No such sprint Title')
    })
  })

  describe('addNewSprint', () => {
    it('should add a new sprint to the table', async () => {
      const newSprint = await repository.addNewSprint({
        sprintCode: 'WD-3.3',
        sprintTitle: 'Node.js Fundamentals',
      })

      expect(newSprint).toMatchObject({
        id: expect.any(Number),
        sprintCode: 'WD-3.3',
        sprintTitle: 'Node.js Fundamentals',
      })

      const sprintsInDb = await db.selectFrom('sprint').selectAll().execute()
      expect(sprintsInDb.length).toBe(3)
    })

    it('should return undefined if something goes wrong (unlikely in SQLite test)', async () => {})
  })

  describe('updateSprint', () => {
    it('should update an existing sprint', async () => {
      const updated = await repository.updateSprint(
        { sprintTitle: 'Updated Title' },
        1
      )

      expect(updated).toEqual({
        id: 1,
        sprintCode: 'WD-1.1',
        sprintTitle: 'Updated Title',
      })

      const sprintInDb = await db
        .selectFrom('sprint')
        .selectAll()
        .where('id', '=', 1)
        .executeTakeFirst()

      expect(sprintInDb?.sprintTitle).toBe('Updated Title')
    })

    it('should return undefined if the sprint does not exist', async () => {
      const updated = await repository.updateSprint(
        { sprintTitle: 'Does Not Exist' },
        999
      )
      expect(updated).toBeUndefined()
    })
  })

  describe('deleteSprint', () => {
    it('should delete an existing sprint by ID and return info about the deletion', async () => {
      const deleted = await repository.deleteSprint(1)

      console.log('deleteSprint result:', deleted)

      const rowsAfter = await db.selectFrom('sprint').selectAll().execute()
      expect(rowsAfter.length).toBe(1)
      expect(rowsAfter[0].id).toBe(2)
    })
  })
})
