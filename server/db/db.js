import pkg from 'pg'

const { Pool } = pkg

const localDatabaseConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'postgres',
  database: process.env.DB_NAME || 'ChatAppDB',
  password: process.env.DB_PASSWORD || 'Next.js',
  port: Number(process.env.DB_PORT) || 5432,
}

const productionDatabaseConfig = process.env.DATABASE_URL
  ? {
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.NODE_ENV === 'production'
        ? { rejectUnauthorized: false }
        : false,
    }
  : null

const pool = new Pool(productionDatabaseConfig || localDatabaseConfig)

pool.connect()
  .then((client) => {
    console.log('Database connected successfully')
    client.release()
  })
  .catch((err) => {
    console.error('Database connection failed:', err.message)
  })

export default pool
