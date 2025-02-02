import { ServerUnaryCall, sendUnaryData, status } from '@grpc/grpc-js'
import { MakePurchaseRequest, MakePurchaseResponse } from '../../../generated/proto/repository.js'
import logger from '../../../common/utils/logger.js'
import { handleError } from '../../../common/error_handlers/handleError.js'
import { PURCHASES_LOGIC } from '../../service/PurchasesLogic.js'

export const MakePurchaseHandler = async (
    call: ServerUnaryCall<MakePurchaseRequest, MakePurchaseResponse>,
    callback: sendUnaryData<MakePurchaseResponse>
): Promise<void> => {
    const { userId, marketHashName } = call.request

    if (!userId || !marketHashName) {
        callback({ code: status.INVALID_ARGUMENT, message: 'Invalid request' }, null)
        return
    }
    try {
        const updatedBalance = await PURCHASES_LOGIC.makePurchase(userId, marketHashName)

        callback(null, { updatedBalance })
    } catch (error) {
        if (error instanceof Error) {
            if (error.message !== 'Internal Server Error') {

                callback({ code: status.RESOURCE_EXHAUSTED, message: error.message }, null)
                return
            }
        }
        handleError(error, 'Update Items Error', logger, callback)
    }
}
