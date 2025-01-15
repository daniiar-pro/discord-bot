import 'dotenv/config'
import createApp from './app'
import createDatabase from './database'

const PORT = 3000
const databaseUrl = process.env.DATABASE_URL

if (!databaseUrl) {
  throw new Error('Provide DATABASE_URL in your environment variables')
}

const database = createDatabase(databaseUrl)

const app = createApp(database)

app.listen(PORT, () =>
  console.log(`Server is running at http://localhost:${PORT}`)
)
