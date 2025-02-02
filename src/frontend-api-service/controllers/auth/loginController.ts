import { status } from '@grpc/grpc-js'
import { FastifyReply, FastifyRequest } from 'fastify'
import { AuthServiceClient, LoginRequest } from '../../../generated/proto/auth.js'
import Joi from 'joi'

const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required()
})
export const login = async (
    request: FastifyRequest<{ Body: LoginRequest }>,
    reply: FastifyReply,
    authClient: AuthServiceClient
): Promise<void> => new Promise((resolve, reject) => {

    const { error, value } = loginSchema.validate(request.body)

    if (error) {
        reply.code(400).send({
            error: 'Validation error',
            details: error.details.map(err => err.message)
        })
        return resolve()
    }

    authClient.login(value, (err, response) => {
        if (err) {
            if ([status.NOT_FOUND, status.UNAUTHENTICATED].includes(err.code)) {

                reply.code(401).send(err)
                return resolve()
            }
            return reject(err)
        }
        reply.code(201).send(response)
        resolve()
    })
})
