import * as grpc from '@grpc/grpc-js'
import { AuthServiceService } from '../generated/proto/auth.js'
import { authServiceHandlers } from './controllers/index.js'
import { connectRedis } from './db/redisClient.js'
import logger from '../common/utils/logger.js'

import 'dotenv/config'

const startServer = async (): Promise<void> => {
    await connectRedis()

    const server = new grpc.Server()

    server.addService(AuthServiceService, authServiceHandlers)

    const port = process.env.AUTH_SERVICE_PORT || '50056'

    server.bindAsync(
        `0.0.0.0:${port}`,
        grpc.ServerCredentials.createInsecure(),
        (err, bindPort) => {
            if (err) {
                logger.error(`Failed to bind Auth gRPC server: ${err.message}`)
                return
            }

            logger.info(`Auth Service gRPC server running on port ${bindPort}`)
        }
    )
}

startServer().catch((error) => {
    logger.error('Failed to start server:', error)
    process.exit(1)
})
