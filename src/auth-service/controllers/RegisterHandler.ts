import { ServerUnaryCall, sendUnaryData, status } from '@grpc/grpc-js'
import { RegisterRequest, RegisterResponse, AuthServiceServer } from '../../generated/proto/auth.js'
import { redisClient } from '../db/redisClient.js'
import logger from '../../common/utils/logger.js'
import { createUser, getUserByEmail } from '../common/repositoryClient.js'
import { uuidv4, passwordHashing } from '../../common/utils/crypto.js'
import { handleError } from '../../common/error_handlers/handleError.js'

export const RegisterHandler: AuthServiceServer['register'] = async (
    call: ServerUnaryCall<RegisterRequest, RegisterResponse>,
    callback: sendUnaryData<RegisterResponse>
): Promise<void> => {
    const { username, email, password } = call.request

    try {
        const existingUser = await getUserByEmail(email)
        if (existingUser !== null) {
            callback({
                code: status.ALREADY_EXISTS,
                message: 'User with this email already exists'
            }, null)

            return
        }

        const newUser = await createUser({
            username,
            email,
            passwordHash: await passwordHashing(password)
        })

        const userId = newUser.userId
        if (userId === 0) {
            callback({
                code: status.INTERNAL,
                message: 'Internal Server Error'
            }, null)

            return
        }

        const sessionToken = uuidv4()

        const pipeline = redisClient.multi()
        pipeline.set(sessionToken, userId.toString(), { EX: 3600 })
        pipeline.set(`user:${userId}:session`, sessionToken, { EX: 3600 })
        await pipeline.exec()

        logger.info(`User registered: ${email}, Session: ${sessionToken}`)

        callback(null, { userId, sessionToken })
    } catch (error) {
        handleError(error, 'Register Error', logger, callback)
    }
}
