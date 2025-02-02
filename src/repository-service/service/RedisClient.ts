import { Item } from '../../generated/proto/repository.js'
import { redisClient } from '../db/redisClient.js'

const ITEM_PREFIX = 'i:'
const ITEM_LIST_KEY = 'itemList'
const ITEM_TTL = 60 * 60 * 24
class RedisClient {

    readonly getItems = async (offset: number, limit: number): Promise<Item[]> => {
        const itemKeys = await redisClient.lRange(ITEM_LIST_KEY, offset, offset + limit - 1)

        if (itemKeys.length === 0) {
            return []
        }

        const itemDataArray = await redisClient.mGet(itemKeys)

        return itemDataArray.map(itemData => itemData ? JSON.parse(itemData) : null)
            .filter(item => item !== null)
    }

    readonly getAllItems = async (): Promise<Item[]> => this.getItems(0, -1)

    readonly getItemsCount = async (): Promise<number> => redisClient.lLen(ITEM_LIST_KEY)

    readonly setNewItems = async (items: Item[]): Promise<boolean> => {
        const pipeline = redisClient.multi()

        const newListKey = `${ITEM_LIST_KEY}:temp`
        items.forEach(item => {
            const key = `${ITEM_PREFIX}${item.marketHashName}`
            pipeline.set(key, JSON.stringify(item), { EX: ITEM_TTL })
            pipeline.rPush(newListKey, key)
        })

        const results = await pipeline.exec()

        if (results && results.length === items.length * 2) {
            await redisClient.rename(newListKey, ITEM_LIST_KEY)

            return true
        } else {
            return false
        }
    }
}

export const REDIS_CLIENT = new RedisClient()
