import type { Database } from '../../database'

export default (db: Database) => ({
  getAllMessages: async () => db.selectFrom('messages').selectAll().execute(),
})
