import { ServerUnaryCall, sendUnaryData } from '@grpc/grpc-js'
import { UpdateUserPasswordRequest, UpdateUserPasswordResponse } from '../../../generated/proto/repository.js'
import { USER_DAO } from '../../service/dao/UserDao.js'
import logger from '../../../common/utils/logger.js'
import { handleError } from '../../../common/error_handlers/handleError.js'

export const UpdateUserPasswordHandler = async (
    call: ServerUnaryCall<UpdateUserPasswordRequest, UpdateUserPasswordResponse>,
    callback: sendUnaryData<UpdateUserPasswordResponse>
): Promise<void> => {
    const { userId, newPasswordHash } = call.request

    try {
        const result = await USER_DAO.updatePasswordHash(userId, newPasswordHash)

        if (result === 0) {
            callback(null, { message: 'User not found' })
            return
        }

        callback(null, { message: 'User password updated successfully' })
    } catch (error) {
        handleError(error, 'UpdateUserPassword Error', logger, callback)
    }
}
