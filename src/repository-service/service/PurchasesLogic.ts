import logger from '../../common/utils/logger.js'
import { sql } from '../db/PGclient.js'
import { PRODUCT_DAO } from './dao/ProductDao.js'
import { PURCHASES_DAO } from './dao/PurchasesDao.js'
import { USER_DAO } from './dao/UserDao.js'


export class PurchasesLogic {
    async makePurchase(userId: number, market_hash_name: string): Promise<number> {
        if (!userId || !market_hash_name) {
            throw new Error('Invalid request')
        }

        const user = await USER_DAO.findById(userId)

        if (!user) {
            throw new Error('User not found')
        }

        const [product] = await PRODUCT_DAO.findByKey('code', market_hash_name)

        if (!product) {
            throw new Error('Product not found')
        }

        if (product.quantity < 1) {
            throw new Error('Product out of stock')
        }

        if (user.balance < product.price) {
            throw new Error('Insufficient funds')
        }

        return sql.begin(async trx => {
            await PRODUCT_DAO.decreaseQuantity(product.id, 1, trx)
            const updatedBalance = await USER_DAO.decrementBalance(userId, product.price, trx)
            await PURCHASES_DAO.create(userId, product.id, product.price, trx)

            logger.info(`User ${userId} purchased product ${product.id} for ${product.price} balance: ${updatedBalance}`)

            return updatedBalance
        }).catch(error => {
            logger.error('Failed to make purchase', error)
            throw new Error('Internal Server Error')
        })
    }
}

export const PURCHASES_LOGIC = new PurchasesLogic()
