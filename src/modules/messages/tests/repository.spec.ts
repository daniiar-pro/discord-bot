import createTestDatabase from '../../../tests/utils/createTestDatabase'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import buildRepository from '../repository'

let db: Awaited<ReturnType<typeof createTestDatabase>>
let repository: ReturnType<typeof buildRepository>

beforeEach(async () => {
  db = await createTestDatabase()
  repository = buildRepository(db)

  await db
    .insertInto('messages')
    .values([
      { message: 'You did it! 👏' },
      { message: 'Great job! 🎉' },
      { message: 'Keep going, you’re doing amazing! 🚀' },
    ])
    .execute()

  await db
    .insertInto('users')
    .values([
      {
        userName: 'John',
        sprintCode: 'WD-1.1',
        sprintTitle: 'intro to python',
        congratsMessage: 'Great effort! 👏',
      },
      {
        userName: 'John',
        sprintCode: 'WD-1.1',
        sprintTitle: 'intro  to js',
        congratsMessage: 'Well done! 🎉',
      },
    ])
    .execute()
})

afterEach(async () => {
  await db.destroy()
})

describe('Repository Tests', () => {
  describe('getAllMessages', () => {
    it('should return all messages from the messages table', async () => {
      const messages = await repository.getAllMessages()

      expect(messages.length).toBe(3)
      expect(messages).toEqual([
        { id: 1, message: 'You did it! 👏' },
        { id: 2, message: 'Great job! 🎉' },
        { id: 3, message: 'Keep going, you’re doing amazing! 🚀' },
      ])
    })
  })

  describe('getMessagesForSprint', () => {
    it('should return all congratulatory messages for a specific sprint', async () => {
      const sprintMessages = await repository.getMessagesForSprint('WD-1.1')

      expect(sprintMessages.length).toBe(2)
      expect(sprintMessages).toEqual([
        { congratsMessage: 'Great effort! 👏' },
        { congratsMessage: 'Well done! 🎉' },
      ])
    })

    it('should return an empty array if no messages exist for the sprint', async () => {
      const sprintMessages =
        await repository.getMessagesForSprint('NonexistentSprint')

      expect(sprintMessages.length).toBe(0)
      expect(sprintMessages).toEqual([])
    })
  })
})
