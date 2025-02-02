import * as grpc from '@grpc/grpc-js'
import { ProductServiceService } from '../generated/proto/product.js'
import { productServiceHandlers } from './controllers/index.js'
import logger from '../common/utils/logger.js'

import 'dotenv/config'

const startServer = async (): Promise<void> => {
    const server = new grpc.Server()

    server.addService(ProductServiceService, productServiceHandlers)

    const port = process.env.PRODUCT_SERVICE_PORT || '50057'

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
