import { ServerUnaryCall, sendUnaryData, status } from '@grpc/grpc-js'
import { GetUserByEmailRequest, GetUserByEmailResponse } from '../../../generated/proto/repository.js'
import { USER_DAO } from '../../service/dao/UserDao.js'
import logger from '../../../common/utils/logger.js'
import { handleError } from '../../../common/error_handlers/handleError.js'

export const GetUserByEmailHandler = async (
    call: ServerUnaryCall<GetUserByEmailRequest, GetUserByEmailResponse>,
    callback: sendUnaryData<GetUserByEmailResponse>
): Promise<void> => {
    const { email } = call.request

    try {
        const user = await USER_DAO.findByEmail(email)

        if (user === null) {
            callback({
                code: status.NOT_FOUND,
                message: 'User not found'
            })
            return
        }
        const response: GetUserByEmailResponse = {
            id: user.id,
            username: user.username,
            email: user.email,
            balance: user.balance,
            passwordHash: user.password_hash,
            createdAt: user.created_at.toISOString()
        }

        callback(null, response)
    } catch (error) {
        handleError(error, 'GetUserByEmail Error', logger, callback)
    }
}
