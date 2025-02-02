import { FastifyReply, FastifyRequest } from 'fastify'
import Joi from 'joi'
import { ProductServiceClient } from '../../../generated/proto/product.js'

export interface BuyBody {
    code: string
}

const buySchema = Joi.object({
    code: Joi.string().required()
})

export const buy = async (
    request: FastifyRequest<{ Body: BuyBody }>,
    reply: FastifyReply,
    productClient: ProductServiceClient
): Promise<void> => new Promise((resolve, reject) => {

    const { error, value } = buySchema.validate(request.body)
    if (error) {
        reply.code(400).send({
            error: 'Validation error',
            details: error.details.map(err => err.message)
        })
        return resolve()
    }

    const user = request.user

    if (!user) {
        reply.code(401).send({ error: 'Unauthorized' })
        return resolve()
    }

    productClient.purchaseItem({ userId: user.id, marketHashName: value.code }, (err, response) => {
        if (err) {
            return reject(err)
        }

        reply.send({ updatedBalance: response.updatedBalance })
        resolve()
    })
})
