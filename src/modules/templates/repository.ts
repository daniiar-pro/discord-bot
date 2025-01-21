import type { Database } from '../../database'

export let messageTemplate = ''

export default (db: Database) => ({
  getTemplate: async () =>
    await db
      .selectFrom('templates')
      .select('template')
      .selectAll()
      .executeTakeFirst(),

  getTemplateById: async (id) => {
    const selectedTemplate = await db
      .selectFrom('templates')
      .select('template')
      .where('id', '=', id)
      .executeTakeFirst()
    messageTemplate = selectedTemplate?.template as string
    return selectedTemplate
  },

  createNewTemplate: async (newTemplate) =>
    await db
      .insertInto('templates')
      .values({ template: newTemplate })
      .returningAll()
      .executeTakeFirst(),

  updateTemplate: async (newValue, id) => {
    const updatedRow = await db
      .updateTable('templates')
      .set({ template: newValue })
      .where('id', '=', id)
      .returningAll()
      .executeTakeFirst()
    return updatedRow
  },

  deleteTemplate: async (id) => {
    const deletedRow = await db
      .deleteFrom('templates')
      .where('id', '=', id)
      .executeTakeFirst()
    return deletedRow
  },
})

export const getMessageTemplate = async () => {
  return messageTemplate
}
