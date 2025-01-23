import createTestDatabase from '../../../tests/utils/createTestDatabase'
import { setupTestApp } from '../../../tests/setupTestApp'
import supertest from 'supertest'
import { beforeEach, afterEach, describe, it, expect } from 'vitest'

let db: Awaited<ReturnType<typeof createTestDatabase>>
let app: ReturnType<typeof setupTestApp>

beforeEach(async () => {
  db = await createTestDatabase()
  app = setupTestApp(db)
})

afterEach(async () => {
  await db.destroy()
})

// Get all messages
describe('/messages', () => {
  it('should return a list of congratulatory messages', async () => {
    await db
      .insertInto('messages')
      .values([
        { id: 1, message: 'You did it! I knew you could. 🤗' },
        {
          id: 2,
          message:
            'You’ve done it! Congratulations on your great achievement!👏\n',
        },
        { id: 3, message: 'Whoop! You are doing great!!🤘' },
      ])
      .execute()

    const response = await supertest(app).get('/messages')

    expect(response.status).toBe(200)

    expect(response.body).toEqual([
      { id: 1, message: 'You did it! I knew you could. 🤗' },
      {
        id: 2,
        message:
          'You’ve done it! Congratulations on your great achievement!👏\n',
      },
      { id: 3, message: 'Whoop! You are doing great!!🤘' },
    ])

    expect(response.headers['content-type']).toMatch(/json/)
  })

  it(`should return 'no messages found' if there is no any message yet exist`, async () => {
    const response = await supertest(app).get('/messages')

    expect(response.status).toBe(404)
  })
})

describe('/messages/username/:userName', () => {
  it('should return all congratulatory messages for a specific user', async () => {
    await db
      .insertInto('users')
      .values([
        {
          userName: 'John',
          sprintCode: 'WD-1.1',
          sprintTitle: 'Intro to Python',
          congratsMessage: 'Applause on your well-deserved success.👏',
        },
        {
          userName: 'John',
          sprintCode: 'WD-1.2',
          sprintTitle: 'Intro to JS',
          congratsMessage: 'This calls for celebrating!🥂 Congratulations! 🥳',
        },
      ])
      .execute()

    const response = await supertest(app).get('/messages/username/John')

    expect(response.status).toBe(200)
    expect(response.body).toEqual([
      { congratsMessage: 'Applause on your well-deserved success.👏' },
      { congratsMessage: 'This calls for celebrating!🥂 Congratulations! 🥳' },
    ])
  })

  it(`should return not found it not valid user searched`, async () => {
    const response = await supertest(app).get('/messages/username/notvalidUser')

    expect(response.status).toBe(404)
  })
})
