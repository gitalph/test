import { FastifyReply, FastifyRequest } from 'fastify'
import Joi from 'joi'
import { GetItemsRequest, ProductServiceClient } from '../../../generated/proto/product.js'

const getItemsQuerySchema = Joi.object({
    page: Joi.number().integer().min(1).default(1)
        .messages({ 'number.base': 'Page must be a number', 'number.min': 'Page must be at least 1' }),
    pageSize: Joi.number().integer().min(1).max(1000).default(10)
        .messages({ 'number.base': 'Page size must be a number', 'number.min': 'Page size must be at least 1', 'number.max': 'Page size must not exceed 1000' })
})

export const getItems = async (
    request: FastifyRequest<{ Body: GetItemsRequest }>,
    reply: FastifyReply,
    productClient: ProductServiceClient
): Promise<void> => new Promise((resolve, reject) => {

    const { error, value } = getItemsQuerySchema.validate(request.query)
    if (error) {
        reply.code(400).send({
            error: 'Validation error',
            details: error.details.map(err => err.message)
        })
        return resolve()
    }

    const { page, pageSize } = value

    productClient.getItems({ page, pageSize }, (err, response) => {

        if (err) {
            return reject(err)
        }

        const plainItems = response.items.map(item => ({
            marketHashName: item.marketHashName,
            minPrice: item.minPrice ? item.minPrice / 100 : null,
            tradableMinPrice: item.tradableMinPrice ? item.tradableMinPrice / 100 : null
        }))

        reply.send({ items: plainItems, total: response.total })
        resolve()
    })
})
