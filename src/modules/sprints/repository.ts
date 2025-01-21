import { Insertable, Selectable, Updateable } from 'kysely'
import type { Database, Sprint } from '../../database'

const TABLE_SPRINT = 'sprint'
type Row = Sprint
type RowWithoutId = Omit<Row, 'id'>
type RowInsert = Insertable<RowWithoutId>
type RowUpdate = Updateable<RowWithoutId>
type RowSelect = Selectable<Row>

export default (db: Database) => ({
  getAllSprint: async () =>
    await db.selectFrom(TABLE_SPRINT).selectAll().execute(),

  getSprintById: async (id: number) => {
    const selectedSprint = await db
      .selectFrom(TABLE_SPRINT)
      .selectAll()
      .where('id', '=', id)
      .executeTakeFirst()
    return selectedSprint
  },

  assignSprintTitle: async (sprintCode: string): Promise<string> => {
    const result = await db
      .selectFrom(TABLE_SPRINT)
      .select('sprintTitle')
      .where('sprintCode', '=', sprintCode)
      .executeTakeFirst()
    return result?.sprintTitle || 'No such sprint Title'
  },

  addNewSprint: async (record: RowInsert): Promise<RowSelect | undefined> => {
    const newSprint = await db
      .insertInto(TABLE_SPRINT)
      .values(record)
      .returningAll()
      .executeTakeFirst()
    return newSprint
  },

  updateSprint: async (partial: RowUpdate, id: number) => {
    const updatedRow = await db
      .updateTable(TABLE_SPRINT)
      .set(partial)
      .where('id', '=', id)
      .returningAll()
      .executeTakeFirst()
    return updatedRow
  },

  deleteSprint: async (id: number) => {
    const deletedRow = await db
      .deleteFrom(TABLE_SPRINT)
      .where('id', '=', id)
      .executeTakeFirst()
    return deletedRow
  },
})
