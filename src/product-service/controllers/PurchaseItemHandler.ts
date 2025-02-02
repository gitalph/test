import { ServerErrorResponse, ServerUnaryCall, StatusObject, sendUnaryData, status } from '@grpc/grpc-js'
import { ProductServiceServer } from '../../generated/proto/product.js'
import { MakePurchaseRequest, MakePurchaseResponse } from '../../generated/proto/repository.js'
import { purchaseItem } from '../common/repositoryClient.js'

export const PurchaseItemHandler: ProductServiceServer['purchaseItem'] = async (
    call: ServerUnaryCall<MakePurchaseRequest, MakePurchaseResponse>,
    callback: sendUnaryData<MakePurchaseResponse>
): Promise<void> => {
    const { userId, marketHashName } = call.request

    try {
        if (!userId || !marketHashName) {
            callback({
                code: status.INVALID_ARGUMENT,
                message: 'Invalid request'
            }, null)

            return
        }

        callback(null, await purchaseItem(userId, marketHashName))
    } catch (error) {
        callback(error as Partial<StatusObject> | ServerErrorResponse, null)
    }
}