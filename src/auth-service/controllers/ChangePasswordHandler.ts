// src/auth-service/controllers/ChangePassword.ts

import { ServerUnaryCall, sendUnaryData, status } from '@grpc/grpc-js'
import { ChangePasswordRequest, ChangePasswordResponse, AuthServiceServer } from '../../generated/proto/auth.js'
import { redisClient } from '../db/redisClient.js'
import logger from '../../common/utils/logger.js'
import { getUserById, updateUserPassword } from '../common/repositoryClient.js'
import { verifyPasswordMismatch, passwordHashing } from '../../common/utils/crypto.js'
import { handleError } from '../../common/error_handlers/handleError.js'

export const ChangePasswordHandler: AuthServiceServer['changePassword'] = async (
    call: ServerUnaryCall<ChangePasswordRequest, ChangePasswordResponse>,
    callback: sendUnaryData<ChangePasswordResponse>
): Promise<void> => {
    const { userId, oldPassword, newPassword } = call.request

    try {
        if (!userId || !oldPassword || !newPassword) {
            callback({
                code: status.INVALID_ARGUMENT,
                message: 'Invalid request'
            }, null)

            return
        }

        const userResult = await getUserById(userId)
        if (userResult === null) {
            callback({
                code: status.NOT_FOUND,
                message: 'User not found'
            }, null)

            return
        }

        if (await verifyPasswordMismatch(oldPassword, userResult.passwordHash)) {
            callback({
                code: status.UNAUTHENTICATED,
                message: 'Invalid current password'
            }, null)

            return
        }

        await updateUserPassword({
            userId,
            newPasswordHash: await passwordHashing(newPassword)
        })

        const sessionToken = await redisClient.get(`user:${userId}:session`)

        if (sessionToken) {
            await redisClient.del(sessionToken)
        }
        await redisClient.del(`user:${userId}:session`)

        logger.info(`Password changed for userId: ${userId}. Session invalidated.`)

        callback(null, { message: 'Password changed successfully. Please log in again.' })
    } catch (error: unknown) {
        handleError(error, 'Change Password Error', logger, callback)
    }
}

