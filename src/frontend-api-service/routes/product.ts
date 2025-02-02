import { FastifyInstance } from 'fastify'
import { AuthServiceClient } from '../../generated/proto/auth.js'
import { GetItemsRequest, ProductServiceClient } from '../../generated/proto/product.js'
import { getItems } from '../controllers/product/getItemsController.js'
import { sessionValidator } from '../middlewares/sessionValidator.js'
import { buy, BuyBody } from '../controllers/product/BuyController.js'

interface ProductRouteOptions {
    authClient: AuthServiceClient
    productClient: ProductServiceClient
}

export const productRoutes = async (app: FastifyInstance, options: ProductRouteOptions): Promise<void> => {
    const { authClient, productClient } = options

    app.get<{ Body: GetItemsRequest }>(
        '/items',
        {
            preHandler: sessionValidator(authClient),
            schema: {
                headers: {
                    type: 'object',
                    properties: {
                        'x-session-token': { type: 'string', description: 'Session token required for authentication' }
                    },
                    required: ['x-session-token']
                },
                querystring: {
                    type: 'object',
                    properties: {
                        page: { type: 'integer', default: 1, description: 'Page number for pagination' },
                        pageSize: { type: 'integer', default: 10, description: 'Number of items per page (max 1000)' }
                    }
                },
                response: {
                    200: {
                        type: 'object',
                        properties: {
                            items: {
                                type: 'array',
                                items: {
                                    type: 'object',
                                    properties: {
                                        marketHashName: { type: 'string' },
                                        minPrice: { type: 'number' },
                                        tradableMinPrice: { type: 'number' }
                                    },
                                    required: ['marketHashName', 'minPrice', 'tradableMinPrice']
                                }
                            },
                            total: { type: 'integer' }
                        }
                    }
                }
            }
        },
        async (request, reply) => getItems(request, reply, productClient)
    )

    app.post<{ Body: BuyBody }>(
        '/buy',
        {
            preHandler: sessionValidator(authClient),
            schema: {
                headers: {
                    type: 'object',
                    properties: {
                        'x-session-token': { type: 'string', description: 'Session token required for authentication' }
                    },
                    required: ['x-session-token']
                },
                body: {
                    type: 'object',
                    properties: {
                        code: { type: 'string', default: 'chem_haz_specialist_swat', description: 'Code of the item to buy' }
                    },
                    required: ['code']
                },
                response: {
                    200: {
                        type: 'object',
                        properties: {
                            updatedBalance: { type: 'number' }
                        }
                    }
                }
            }
        },
        async (request, reply) => buy(request, reply, productClient)
    )

}
