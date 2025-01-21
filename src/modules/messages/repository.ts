import { Insertable, Selectable } from 'kysely'
import type { Database, Users, Messages } from '../../database'
// import { keys } from './schema'

const TABLE_USERS = 'users'
const TABLE_MESSAGES = 'messages'
// type TableName = typeof TABLE_USERS

type RowUsers = Users
type RowMessages = Messages

type RowWithoutId = Omit<RowUsers, 'id'>
type RowInsert = Insertable<RowWithoutId>
type RowSelectUsers = Selectable<RowUsers>
type RowSelectMessages = Selectable<RowMessages>

export default (db: Database) => ({
  getAllMessages: async (): Promise<RowSelectMessages[]> =>
    await db.selectFrom(TABLE_MESSAGES).selectAll().execute(),

  createCongratsMessage: async (
    record: RowInsert
  ): Promise<RowSelectUsers | undefined> => {
    return await db
      .insertInto(TABLE_USERS)
      .values(record)
      .returningAll()
      .executeTakeFirst()
  },

  getMessagesForUser: async (
    username: string
  ): Promise<Pick<RowSelectUsers, 'congratsMessage'>[]> =>
    await db
      .selectFrom(TABLE_USERS)
      .select('congratsMessage')
      .where('userName', '=', username)
      .execute(),

  getMessagesForSprint: async (
    sprintCode: string
  ): Promise<Pick<RowSelectUsers, 'congratsMessage'>[]> =>
    await db
      .selectFrom(TABLE_USERS)
      .select('congratsMessage')
      .where('sprintCode', '=', sprintCode)
      .execute(),
})
