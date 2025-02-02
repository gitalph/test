import { TransactionSql } from 'postgres'

export class PurchasesDao {
    async create(userId: number, productId: number, totalCost: number, trx: TransactionSql): Promise<void> {
        await trx`
            INSERT INTO purchases (user_id, product_id, total_cost)
            VALUES (${userId}, ${productId}, ${totalCost})
        `
    }
}

export const PURCHASES_DAO = new PurchasesDao()
