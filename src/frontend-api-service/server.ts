import fastify from 'fastify'
import swagger from '@fastify/swagger'
import swaggerUi from '@fastify/swagger-ui'

import { credentials } from '@grpc/grpc-js'
import { AuthServiceClient } from '../generated/proto/auth.js'
import { ProductServiceClient } from '../generated/proto/product.js'

import { authRoutes } from './routes/auth.js'
import { productRoutes } from './routes/product.js'

import logger from '../common/utils/logger.js'

const app = fastify()

const authClient = new AuthServiceClient(
    `${process.env.AUTH_SERVICE_HOST}:${process.env.AUTH_SERVICE_PORT}`,
    credentials.createInsecure()
)

const productClient = new ProductServiceClient(
    `${process.env.PRODUCT_SERVICE_HOST}:${process.env.PRODUCT_SERVICE_PORT}`,
    credentials.createInsecure()
)

const swaggerOptions = {
    routePrefix: '/docs',
    swagger: {
        info: {
            title: 'API Documentation',
            description: 'Description of your API',
            version: '1.0.0'
        },
        host: `localhost:${process.env.FRONTEND_API_PORT || 3000}`,
        schemes: ['http'],
        consumes: ['application/json'],
        produces: ['application/json'],
        securityDefinitions: {
            SessionToken: {
                type: 'apiKey' as const, // cast to literal "apiKey"
                name: 'x-session-token',
                in: 'header',
                description: 'Enter your session token after login'
            }
        },
        security: [
            {
                SessionToken: []
            }
        ]
    },
    exposeRoute: true
}

app.register(swagger, swaggerOptions)

app.register(swaggerUi, {
    routePrefix: '/docs',
    uiConfig: {
        docExpansion: 'full',
        deepLinking: false
    },
    staticCSP: true,
    transformSpecificationClone: true
})

app.register(authRoutes, { prefix: '/auth', authClient })
app.register(productRoutes, { prefix: '/product', authClient, productClient })

const start = async (): Promise<void> => {
    try {
        await app.listen({ port: Number(process.env.FRONTEND_API_PORT) || 3000, host: '0.0.0.0' })

        logger.info(`Frontend API Service running on ${JSON.stringify(app.server.address())}`)
    } catch (err) {
        app.log.error(err)

        process.exit(1)
    }
}

start().catch((error) => {
    logger.error('Failed to start server:', error)
    process.exit(1)
})
