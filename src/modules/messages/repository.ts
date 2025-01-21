import type { Database } from '../../database'
// CREATE TABLE IF NOT EXISTS "users" ("id" integer not null primary key autoincrement, "user_name" text not null, "sprint_code" text not null, "sprint_title" text not null, "congrats_message" text not null);
export default (db: Database) => ({
  getAllMessages: async () =>
    await db.selectFrom('messages').selectAll().execute(),

  createCongratsMessage: async (
    user_name: string,
    sprint_code: string,
    sprint_title: string,
    congrats_message: string
  ) => {
    return await db
      .insertInto('users')
      .values({
        userName: user_name,
        sprintCode: sprint_code,
        sprintTitle: sprint_title,
        congratsMessage: congrats_message,
      })
      .returningAll()
      .executeTakeFirst()

    // If the result contains a BigInt, ensure it's converted to a string
  },

  getMessagesForUser: async (username: string) =>
    await db
      .selectFrom('users')
      .select('congratsMessage')
      .where('userName', '=', username)
      .execute(),

  getMessagesForSprint: async (sprintCode: string) =>
    await db
      .selectFrom('users')
      .select('congratsMessage')
      .where('sprintCode', '=', sprintCode)
      .execute(),
})
