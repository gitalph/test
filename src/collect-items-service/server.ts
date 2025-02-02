import logger from '../common/utils/logger.js'

import 'dotenv/config'

import { collectService, sleep } from './services/collectService.js'

const ItemsUrl: string = process.env.COLLECT_SERVICE_SKINPORT_ITEMS_URL || ''

if (!ItemsUrl) {
    throw new Error('COLLECT_SERVICE_SKINPORT_ITEMS_URL is not defined')
}

async function scheduleCollectService(): Promise<void> {
    while (true) {
        await collectService(ItemsUrl)
        await sleep()
    }
}

const FIVE_SECONDS = 2 * 1000

sleep(FIVE_SECONDS).then(
    () => logger.info('Collect Service started')
).then(scheduleCollectService)
    .catch((error) => {
        logger.error('Failed to start collect service:', error)
        process.exit(1)
    })

process.on('SIGTERM', () => {
    logger.info('Process terminated')
    process.exit(0)
})

process.on('SIGINT', () => {
    logger.info('Process interrupted')
    process.exit(0)
})
