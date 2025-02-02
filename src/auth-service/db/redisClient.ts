import { createClient, RedisClientType } from 'redis'
import logger from '../../common/utils/logger.js'

const redisClient: RedisClientType = createClient({
    url: process.env.REDIS_URL || 'redis://localhost:6379'
})

redisClient
    .on('connect', () => logger.info('Redis Client Connected'))
    .on('reconnecting', () => logger.info('Redis Client Reconnecting'))
    .on('ready', () => logger.info('Redis Client Ready'))
    .on('error', (err) => logger.error('Redis Client Error', err))
    .on('end', () => logger.info('Redis Client Disconnected'))

const connectRedis = async (): Promise<void> => {
    if (!redisClient.isOpen) {
        await redisClient.connect()
        logger.info('Connected to Redis')
    }
}

export { redisClient, connectRedis }
