// src/auth-service/controllers/Login.ts

import { ServerUnaryCall, sendUnaryData, status } from '@grpc/grpc-js'
import { LoginRequest, LoginResponse, AuthServiceServer } from '../../generated/proto/auth.js'
import { getUserByEmail } from '../common/repositoryClient.js'
import { redisClient } from '../db/redisClient.js'
import logger from '../../common/utils/logger.js'
import { verifyPasswordMismatch, uuidv4 } from '../../common/utils/crypto.js'
import { handleError } from '../../common/error_handlers/handleError.js'

export const LoginHandler: AuthServiceServer['login'] = async (
    call: ServerUnaryCall<LoginRequest, LoginResponse>,
    callback: sendUnaryData<LoginResponse>
): Promise<void> => {
    const { email, password } = call.request

    try {
        const user = await getUserByEmail(email)
        if (user === null) {
            callback({
                code: status.NOT_FOUND,
                message: 'User not found'
            }, null)

            return
        }

        if (await verifyPasswordMismatch(password, user.passwordHash)) {
            callback({
                code: status.UNAUTHENTICATED,
                message: 'Invalid credentials'
            }, null)

            return
        }

        const existingSessionToken = await redisClient.get(`user:${user.id}:session`)
        if (existingSessionToken) {
            await redisClient.del(existingSessionToken)
            logger.info(`Old session invalidated for userId: ${user.id}`)
        }

        const newSessionToken = uuidv4()

        const pipeline = redisClient.multi()
        pipeline.set(newSessionToken, user.id.toString(), { EX: 3600 })
        pipeline.set(`user:${user.id}:session`, newSessionToken, { EX: 3600 })
        await pipeline.exec()

        logger.info(`User logged in: ${email}, New Session: ${newSessionToken}`)

        callback(null, {
            sessionToken: newSessionToken,
            username: user.username,
            balance: user.balance
        })
    } catch (error) {
        handleError(error, 'Login Error', logger, callback)
    }
}
