import { ServerUnaryCall, sendUnaryData } from '@grpc/grpc-js'
import { CreateUserRequest, CreateUserResponse } from '../../../generated/proto/repository.js'
import { USER_DAO } from '../../service/dao/UserDao.js'
import logger from '../../../common/utils/logger.js'
import { handleError } from '../../../common/error_handlers/handleError.js'

export const CreateUserHandler = async (
    call: ServerUnaryCall<CreateUserRequest, CreateUserResponse>,
    callback: sendUnaryData<CreateUserResponse>
): Promise<void> => {
    const { username, email, passwordHash } = call.request

    try {
        const existingUser = await USER_DAO.findByEmail(email)

        if (existingUser !== null) {
            logger.warn(`User with email ${email} already exists`)
            callback(null, { userId: 0 })

            return
        }

        const result = await USER_DAO.create({
            username,
            email,
            password_hash: passwordHash
        })

        if (result === null) {
            callback(null, { userId: 0 })
            return
        }

        callback(null, { userId: result.id })
    } catch (error) {
        handleError(error, 'Create User Error', logger, callback)
    }
}
