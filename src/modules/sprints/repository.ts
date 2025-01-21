import type { Database } from '../../database'

export default (db: Database) => ({
  getAllSprint: async () => await db.selectFrom('sprint').selectAll().execute(),

  getSprintById: async (id) => {
    const selectedSprint = await db
      .selectFrom('sprint')
      .selectAll()
      .where('id', '=', id)
      .executeTakeFirst()
    return selectedSprint
  },

  assignSprintTitle: async (sprintCode:string) => {
    const result = await db
      .selectFrom('sprint')
      .select('sprintTitle')
      .where('sprintCode', '=', sprintCode)
      .executeTakeFirst()
    return result?.sprintTitle || 'No such sprint Title'
  },

  addNewSprint: async (sprintTitle, sprintCode) => {
    const newSprint = await db
      .insertInto('sprint')
      .values({ sprintTitle: sprintTitle, sprintCode: sprintCode })
      .returningAll()
      .executeTakeFirst()
    return newSprint
  },

  updateSprint: async (newSprintTitle, newSprintCode, id) => {
    const updatedRow = await db
      .updateTable('sprint')
      .set({ sprintTitle: newSprintTitle, sprintCode: newSprintCode })
      .where('id', '=', id)
      .returningAll()
      .executeTakeFirst()
    return updatedRow
  },

  deleteSprint: async (id) => {
    const deletedRow = await db
      .deleteFrom('sprint')
      .where('id', '=', id)
      .executeTakeFirst()
    return deletedRow
  },
})
