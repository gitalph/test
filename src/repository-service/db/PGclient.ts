import postgres, { Sql } from 'postgres'
import logger from '../../common/utils/logger.js'

import 'dotenv/config'

const sql: Sql = postgres(process.env.DATABASE_URL || 'postgres://youruser:yourpassword@localhost:5432/yourdb', {
    ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
    debug: (query, parameters) => {
        logger.debug('SQL Query Executed', { query, parameters })
    },
    max: 20,
    idle_timeout: 10000,
    connect_timeout: 5000
})

export { sql }
