import { Kysely, SqliteDatabase } from 'kysely'

export async function up(db: Kysely<SqliteDatabase>) {
  await db.schema
    .createTable('messages')
    .ifNotExists()
    .addColumn('id', 'integer', (c) => c.primaryKey().autoIncrement().notNull())
    .addColumn('message', 'text', (c) => c.notNull())
    .execute()

  await db.schema
    .createTable('users')
    .ifNotExists()
    .addColumn('id', 'integer', (c) => c.primaryKey().autoIncrement().notNull())
    .addColumn('user_name', 'text', (c) => c.notNull())
    .addColumn('sprint_code', 'text', (c) => c.notNull())
    .addColumn('sprint_title', 'text', (c) => c.notNull())
    .addColumn('congrats_message', 'text', (c) => c.notNull())
    .execute()
}

export async function down() {
  // unnecessary, as this is the first migration, we can just delete the database
}

// import { Kysely, SqliteDatabase } from 'kysely'

// export async function up(db: Kysely<SqliteDatabase>) {

//   await db.schema
//   .createTable('messages')
//   .ifNotExists()
//   .addColumn('id', 'integer', (c) => c.primaryKey().autoIncrement().notNull())
//   .addColumn('message', 'text', (c) => c.notNull())
//   .execute()

//   // await db.schema
//   //   .createTable('accomplished_users')
//   //   .ifNotExists()
//   //   .addColumn('id', 'integer', (c) => c.primaryKey().autoIncrement().notNull())
//   //   .addColumn('user_name', 'text', (c) => c.notNull())
//   //   .addColumn('sprint_name', 'text', (c) => c.notNull())
//   //   .addColumn('congrulatory_message', 'text', (c) => c.notNull())
//   //   .execute()

// }

// export async function down() {
//   // unnecessary, as this is the first migration, we can just delete the database
// }
