import { status } from '@grpc/grpc-js'
import { FastifyReply, FastifyRequest } from 'fastify'
import Joi from 'joi'
import { AuthServiceClient, RegisterRequest } from '../../../generated/proto/auth.js'

const registerSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    username: Joi.string().min(3).max(30).required()
})

export const register = async (
    request: FastifyRequest<{ Body: RegisterRequest }>,
    reply: FastifyReply,
    authClient: AuthServiceClient
): Promise<void> => new Promise((resolve, reject) => {
    const { error, value } = registerSchema.validate(request.body, { abortEarly: false })

    if (error) {
        reply.code(400).send({
            error: 'Validation error',
            details: error.details.map(err => err.message)
        })
        return resolve()
    }
    authClient.register(value, (err, res) => {
        if (err) {
            if (err.code === status.ALREADY_EXISTS) {

                reply.code(409).send(err)
                return resolve()
            }
            return reject(err)
        }
        reply.send(res)
        resolve()
    })
})
