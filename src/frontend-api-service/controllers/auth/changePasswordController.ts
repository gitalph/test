import { FastifyReply, FastifyRequest } from 'fastify'
import Joi from 'joi'
import { AuthServiceClient } from '../../../generated/proto/auth.js'

export interface ChangePasswordRequestBody {
    oldPassword: string
    newPassword: string
}

const changePasswordSchema = Joi.object({
    newPassword: Joi.string().min(6).required(),
    oldPassword: Joi.string().min(6).required()
})

export const changePassword = async (
    request: FastifyRequest<{ Body: ChangePasswordRequestBody }>,
    reply: FastifyReply,
    authClient: AuthServiceClient
): Promise<void> => new Promise((resolve, reject) => {

    const { error } = changePasswordSchema.validate(request.body)
    if (error) {
        reply.code(400).send({
            error: 'Validation error',
            details: error.details.map(err => err.message)
        })
        return resolve()
    }

    const userId = request.user?.id || 0

    if (!userId) {
        reply.code(401).send({ error: 'Unauthorized' })
        return resolve()
    }

    const { oldPassword, newPassword } = request.body

    if (oldPassword === newPassword) {
        reply.code(400).send({ error: 'New password should be different from the old one' })
        return resolve()
    }

    authClient.changePassword({ userId, oldPassword, newPassword }, (err) => {
        if (err) {
            return reject(err)
        }

        reply.send({ message: 'Password updated successfully' })
        resolve()
    })
})
