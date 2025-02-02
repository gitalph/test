import { ServerUnaryCall, sendUnaryData } from '@grpc/grpc-js'
import { ValidateSessionRequest, ValidateSessionResponse, AuthServiceServer } from '../../generated/proto/auth.js'
import { redisClient } from '../db/redisClient.js'
import logger from '../../common/utils/logger.js'
import { handleError } from '../../common/error_handlers/handleError.js'

export const ValidateSessionHandler: AuthServiceServer['validateSession'] = async (
    call: ServerUnaryCall<ValidateSessionRequest, ValidateSessionResponse>,
    callback: sendUnaryData<ValidateSessionResponse>
): Promise<void> => {
    const { sessionToken } = call.request

    try {
        const userIdStr = await redisClient.get(sessionToken)
        if (!userIdStr) {
            callback(null, { isValid: false, userId: 0 })

            return
        }

        const userId = parseInt(userIdStr, 10)

        const existingSessionToken = await redisClient.get(`user:${userId}:session`)
        if (existingSessionToken !== sessionToken) {
            callback(null, { isValid: false, userId: 0 })

            return
        }

        await redisClient.expire(sessionToken, 3600)
        await redisClient.expire(`user:${userId}:session`, 3600)

        callback(null, { isValid: true, userId })
    } catch (error) {
        handleError(error, 'Validate Session Error', logger, callback)
    }
}
