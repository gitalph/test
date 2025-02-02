import { ServerUnaryCall, sendUnaryData, status } from '@grpc/grpc-js'
import { GetUserRequest, GetUserResponse } from '../../../generated/proto/repository.js'
import logger from '../../../common/utils/logger.js'
import { USER_DAO } from '../../service/dao/UserDao.js'
import { handleError } from '../../../common/error_handlers/handleError.js'

export const GetUserHandler = async (
    call: ServerUnaryCall<GetUserRequest, GetUserResponse>,
    callback: sendUnaryData<GetUserResponse>
): Promise<void> => {
    const { userId } = call.request

    try {
        const user = await USER_DAO.findById(userId)

        if (user === null) {
            callback({
                code: status.NOT_FOUND,
                message: 'User not found'
            })

            return
        }

        const response: GetUserResponse = {
            id: user.id,
            username: user.username,
            email: user.email,
            balance: user.balance,
            createdAt: user.created_at.toISOString(),
            passwordHash: user.password_hash
        }

        callback(null, response)
    } catch (error) {
        handleError(error, 'GetUser Error', logger, callback)
    }
}
