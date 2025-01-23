import { CamelCasePlugin, Kysely, SqliteDialect } from 'kysely'
import SQLite from 'better-sqlite3'
import { migrateToLatest } from '../../../database/migrate'
import { type DB } from '../../../database'
import ModuleMigrationProvider from './ModuleMigrationProvider'

const DATABASE_FILE = ':memory:'

export default async () => {
  const provider = new ModuleMigrationProvider()

  const database = new Kysely<DB>({
    dialect: new SqliteDialect({ database: new SQLite(DATABASE_FILE) }),
    plugins: [new CamelCasePlugin()],
  })

  const { results, error } = await migrateToLatest(provider, database)

  results
    ?.filter((result) => result.status === 'Error')
    .forEach((result) => {
      console.error(`failed to execute migration "${result.migrationName}"`)
    })

  if (error) {
    console.error('failed to migrate')
    console.error(error)
  }

  await database.schema
    .createTable('messages')
    .ifNotExists()
    .addColumn('id', 'integer', (c) => c.primaryKey().autoIncrement().notNull())
    .addColumn('message', 'text', (c) => c.notNull())
    .execute()

  await database.schema
    .createTable('users')
    .ifNotExists()
    .addColumn('id', 'integer', (c) => c.primaryKey().autoIncrement().notNull())
    .addColumn('user_name', 'text', (c) => c.notNull())
    .addColumn('sprint_code', 'text', (c) => c.notNull())
    .addColumn('sprint_title', 'text', (c) => c.notNull())
    .addColumn('congrats_message', 'text', (c) => c.notNull())
    .execute()

  await database.schema
    .createTable('templates')
    .addColumn('id', 'integer', (col) => col.primaryKey().autoIncrement())
    .addColumn('template', 'text', (col) => col.notNull())
    .execute()

  await database.schema
    .createTable('sprint')
    .addColumn('id', 'integer', (col) => col.primaryKey().autoIncrement())
    .addColumn('sprintCode', 'text', (col) => col.notNull())
    .addColumn('sprintTitle', 'text', (col) => col.notNull())
    .execute()
  return database
}
