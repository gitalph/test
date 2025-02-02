import { Item } from '@/generated/proto/repository.js'
import logger from '../../common/utils/logger.js'
import { saveItems } from '../repositoryClient.js'

const ONE_MINUTE = 60 * 1000

// Endpoint is cached for 5 minutes.
const DEFAUL_SLEEP_TIME = 5 * ONE_MINUTE
export const sleep = (ms: number = DEFAUL_SLEEP_TIME): Promise<void> => new Promise(resolve => setTimeout(resolve, ms))

interface ItemData {
    market_hash_name: string;
    currency: string;
    suggested_price: number;
    item_page: string;
    market_page: string;
    min_price: number | null;
    max_price: number | null;
    mean_price: number | null;
    median_price: number | null;
    quantity: number;
    created_at: number;
    updated_at: number;
}

async function collectItems(url: string): Promise<ItemData[]> {
    const response = await fetch(url, {
        headers: {
            'Accept-Encoding': 'br'
        },
        signal: AbortSignal.timeout(2 * ONE_MINUTE)
    }).then(res => res.json())

    if (response.errors) {
        throw new Error(JSON.stringify(response.errors))
    }

    return response
}

export const collectService = async (ItemsUrl: string): Promise<void> => {
    try {
        const tradableItems = await collectItems(`${ItemsUrl}?tradable=1`)
        const allItems = await collectItems(ItemsUrl)

        const tradableItemsMap = new Map<string, ItemData>()
        for (const item of tradableItems) {
            tradableItemsMap.set(item.market_hash_name, item)
        }

        const items: Item[] = []
        for (const item of allItems) {
            items.push({
                marketHashName: item.market_hash_name,

                minPrice: item.min_price != null ? Math.round(item.min_price * 100) : undefined,

                tradableMinPrice: tradableItemsMap.get(item.market_hash_name)?.min_price != null
                    ? Math.round((tradableItemsMap.get(item.market_hash_name)?.min_price ?? 0) * 100)
                    : undefined
            })
        }

        logger.info(`Items collected: ${items.length}`)

        const response = await saveItems(items)

        logger.info(JSON.stringify(response))
    } catch (error) {
        logger.error('Error collecting data', error)
        return sleep()
    }
}

