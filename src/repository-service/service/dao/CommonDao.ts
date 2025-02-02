import logger from '../../../common/utils/logger.js'
import { sql } from '../../db/PGclient.js'

export abstract class CommonDao<ENTITY extends object> {

    constructor(readonly tableName: string) {
    }

    async findById(id: number): Promise<ENTITY | null> {
        logger.debug(`Finding entity by id: ${id}`)

        const result = await sql<ENTITY[]>`
            SELECT *
            FROM ${sql(this.tableName)}
            WHERE id = ${id}
        `
        return result.length > 0 ? result[0] : null
    }

    async findByKey(key: string, value: string): Promise<ENTITY[]> {
        logger.debug('Finding entity by key', { key, value })

        const result = sql<ENTITY[]>`
            SELECT *
            FROM ${sql(this.tableName)}
                WHERE ${sql(key)} = ${value}
        `
        return result
    }
}
