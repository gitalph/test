import { TransactionSql } from 'postgres'
import { sql } from '../../db/PGclient.js'
import { CommonDao } from './CommonDao.js'

interface UserEntity {
    id: number;
    username: string;
    email: string;
    password_hash: string;
    balance: number;
    created_at: Date;
}

export class UserDao extends CommonDao<UserEntity> {
    constructor() {
        super('users')
    }

    async create(entity: Partial<UserEntity>): Promise<UserEntity | null> {
        const result = await sql`
            INSERT INTO users ${sql(entity, ['username', 'email', 'password_hash'])}
            RETURNING *
        `
        return result.length > 0 ? (result[0] as UserEntity) : null
    }

    async findByEmail(email: string): Promise<UserEntity | null> {
        const users = await this.findByKey('email', email)
        return users.length > 0 ? users[0] : null
    }

    async updatePasswordHash(id: number, passwordHash: string): Promise<number> {
        const result = await sql`
            UPDATE ${sql(this.tableName)}
            SET password_hash = ${passwordHash}
            WHERE id = ${id}
            RETURNING *
        `
        return result.count
    }

    async decrementBalance(userId: number, amount: number, trx: TransactionSql): Promise<number> {
        const result = await trx`
            UPDATE ${sql(this.tableName)}
            SET balance = balance - ${amount}
            WHERE id = ${userId}
            RETURNING balance
        `
        return result[0].balance
    }
}

export const USER_DAO = new UserDao()
