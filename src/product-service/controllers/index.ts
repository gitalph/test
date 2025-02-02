import { ProductServiceServer } from '../../generated/proto/product.js'
import { GetItemsHandler } from './GetItemsHandler.js'
import { PurchaseItemHandler } from './PurchaseItemHandler.js'

export const productServiceHandlers: ProductServiceServer = {
    getItems: GetItemsHandler,
    purchaseItem: PurchaseItemHandler
}
