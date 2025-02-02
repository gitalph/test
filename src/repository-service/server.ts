import * as grpc from '@grpc/grpc-js'
import { RepositoryServiceService } from '../generated/proto/repository.js'
import { repositoryServiceHandlers } from './controllers/index.js'
import logger from '../common/utils/logger.js'
import { initializeDatabase } from './db/initializeDatabase.js'
import 'dotenv/config'
import { connectRedis } from './db/redisClient.js'

const server = new grpc.Server()

server.addService(RepositoryServiceService, repositoryServiceHandlers)

const port = process.env.REPOSITORY_SERVICE_PORT || '50055'

const startServer = async (): Promise<void> => {
    if (process.env.INIT_DB === 'true') {
        logger.info('Initializing database...')
        try {
            await initializeDatabase()
            logger.info('Database initialized successfully.')
        } catch (error) {
            logger.error('Failed to initialize database:', error)

            process.exit(1)
        }
    }

    await connectRedis()

    server.bindAsync(`0.0.0.0:${port}`, grpc.ServerCredentials.createInsecure(), (err, bindPort) => {
        if (err) {
            logger.error(`Failed to bind gRPC server: ${err.message}`)
            return
        }

        logger.info(`Repository Service gRPC server running on port ${bindPort}`)
    })
}

startServer().catch((error) => {
    logger.error('Failed to start server:', error)
    process.exit(1)
})
