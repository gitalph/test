import { ServerUnaryCall, sendUnaryData } from '@grpc/grpc-js'
import { GetItemsRequest, GetItemsResponse } from '../../../generated/proto/repository.js'
import logger from '../../../common/utils/logger.js'
import { handleError } from '../../../common/error_handlers/handleError.js'
import { REDIS_CLIENT } from '../../service/RedisClient.js'

export const GetItemsHandler = async (
    call: ServerUnaryCall<GetItemsRequest, GetItemsResponse>,
    callback: sendUnaryData<GetItemsResponse>
): Promise<void> => {
    try {
        const { offset, limit } = call.request
        const items = limit
            ? await REDIS_CLIENT.getItems(offset, limit)
            : await REDIS_CLIENT.getAllItems()

        callback(null, {
            items,
            total: await REDIS_CLIENT.getItemsCount()
        })
    } catch (error) {
        handleError(error, 'Get Items Error', logger, callback)
    }
}
