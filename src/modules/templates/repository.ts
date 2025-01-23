import { Insertable, Selectable, Updateable } from 'kysely'
import type { Database, Templates } from '../../database'

const TABLE_TEMPLATES = 'templates'

// type TableName = typeof TABLE_TEMPLATES
type Row = Templates

type RowWithoutId = Omit<Row, 'id'>
type RowInsert = Insertable<RowWithoutId>
type RowUpdate = Updateable<RowWithoutId>
type RowSelect = Selectable<Row>

export let messageTemplate = ''

export default (db: Database) => ({
  getTemplate: async () =>
    await db.selectFrom(TABLE_TEMPLATES).selectAll().execute(),

  getTemplateById: async (id: number) => {
    const selectedTemplate = await db
      .selectFrom(TABLE_TEMPLATES)
      .selectAll()
      .where('id', '=', id)
      .executeTakeFirst()
    messageTemplate = selectedTemplate?.template as string
    return selectedTemplate
  },

  createNewTemplate: async (
    record: RowInsert
  ): Promise<RowSelect | undefined> =>
    await db
      .insertInto(TABLE_TEMPLATES)
      .values(record)
      .returningAll()
      .executeTakeFirst(),

  updateTemplate: async (
    id: number,
    partial: RowUpdate
  ): Promise<RowSelect | undefined> => {
    const updatedRow = await db
      .updateTable(TABLE_TEMPLATES)
      .set(partial)
      .where('id', '=', id)
      .returningAll()
      .executeTakeFirst()
    return updatedRow
  },

  deleteTemplate: async (id: number) => {
    const rowToDelete = await db
      .selectFrom(TABLE_TEMPLATES)
      .selectAll()
      .where('id', '=', id)
      .executeTakeFirst()

    if (!rowToDelete) return undefined

    await db.deleteFrom(TABLE_TEMPLATES).where('id', '=', id).executeTakeFirst()
    return rowToDelete
  },
})

export const getMessageTemplate = async () => {
  return messageTemplate
}
