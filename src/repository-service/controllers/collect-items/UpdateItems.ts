import { ServerUnaryCall, sendUnaryData, status } from '@grpc/grpc-js'
import { UpdateItemsRequest, UpdateItemsResponse } from '../../../generated/proto/repository.js'
import logger from '../../../common/utils/logger.js'
import { handleError } from '../../../common/error_handlers/handleError.js'
import { REDIS_CLIENT } from '../../service/RedisClient.js'

export const UpdateItemsHandler = async (
    call: ServerUnaryCall<UpdateItemsRequest, UpdateItemsResponse>,
    callback: sendUnaryData<UpdateItemsResponse>
): Promise<void> => {
    const { items } = call.request

    try {
        if (await REDIS_CLIENT.setNewItems(items)) {
            callback(null, { message: 'Items updated successfully' })

            return
        }

        callback({
            code: status.INTERNAL,
            message: 'Failed to update items'
        }, null)
    } catch (error) {
        handleError(error, 'Update Items Error', logger, callback)
    }
}
