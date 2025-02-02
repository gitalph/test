import fs from 'fs'
import path from 'path'
import { sql } from './PGclient.js'
import logger from '../../common/utils/logger.js'
import { fileURLToPath } from 'url'

export const initializeDatabase = async (): Promise<void> => {
    try {
        const __filename = fileURLToPath(import.meta.url)
        const __dirname = path.dirname(__filename)

        const dbDir = path.join(__dirname, '../../../dbmigration/schema')

        const createTablesPath = path.join(dbDir, 'create_tables.sql')
        const createTablesSql = fs.readFileSync(createTablesPath, 'utf-8')

        await sql.unsafe(createTablesSql)
        logger.info('Tables created or already exist.')

        const insertProductsPath = path.join(dbDir, 'insert_products.sql')
        const insertProductsSql = fs.readFileSync(insertProductsPath, 'utf-8')
        await sql.unsafe(insertProductsSql)
        logger.info('Products inserted or already exist.')
    } catch (error) {
        logger.error('Error initializing database:', error)
        throw error
    }
}
