import { ServerUnaryCall, sendUnaryData, status } from '@grpc/grpc-js'
import logger from '../../common/utils/logger.js'
import { handleError } from '../../common/error_handlers/handleError.js'
import { ProductServiceServer, GetItemsRequest, GetItemsResponse } from '../../generated/proto/product.js'
import { getItems } from '../common/repositoryClient.js'

export const GetItemsHandler: ProductServiceServer['getItems'] = async (
    call: ServerUnaryCall<GetItemsRequest, GetItemsResponse>,
    callback: sendUnaryData<GetItemsResponse>
): Promise<void> => {
    const { page, pageSize } = call.request

    const offset = (page - 1) * pageSize
    const limit = pageSize

    try {
        const response = await getItems(offset, limit)
        if (response === null) {
            callback({
                code: status.OUT_OF_RANGE,
                message: 'No items found'
            }, null)

            return
        }

        callback(null, { items: response.items, total: response.total })
    } catch (error) {
        handleError(error, 'Login Error', logger, callback)
    }
}
