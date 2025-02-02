import { TransactionSql } from 'postgres'
import { sql } from '../../db/PGclient.js'
import { CommonDao } from './CommonDao.js'

interface ProductEntity {
    id: number;
    code: string;
    name: string;
    description: string;
    price: number;
    quantity: number;
    created_at: Date;
}

export class ProductDao extends CommonDao<ProductEntity> {
    constructor() {
        super('products')
    }

    async findByKey(key: string, value: string): Promise<ProductEntity[]> {
        return await sql`
            SELECT * FROM ${sql(this.tableName)}
            WHERE ${sql(key)} = ${value}
        `
    }

    async decreaseQuantity(id: number, quantity: number, trx: TransactionSql): Promise<void> {
        await trx`
            UPDATE ${sql(this.tableName)}
            SET quantity = quantity - ${quantity}
            WHERE id = ${id}
        `
    }
}

export const PRODUCT_DAO = new ProductDao()
