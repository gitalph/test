import { credentials, status } from '@grpc/grpc-js'
import { GetItemsResponse, MakePurchaseResponse, RepositoryServiceClient } from '../../generated/proto/repository.js'

export const repositoryClient = new RepositoryServiceClient(
    `${process.env.REPOSITORY_SERVICE_HOST}:${process.env.REPOSITORY_SERVICE_PORT}`,
    credentials.createInsecure()
)

export function getItems(offset: number, limit: number): Promise<GetItemsResponse | null> {
    return new Promise((resolve, reject) => {
        repositoryClient.getItems({ offset, limit }, (err, res) => {
            if (err) {
                if (err.code === status.NOT_FOUND) {
                    resolve(null)
                } else {
                    reject(err)
                }
            }
            else resolve(res)
        })
    })
}

export function purchaseItem(userId: number, marketHashName: string): Promise<MakePurchaseResponse> {
    return new Promise((resolve, reject) => {
        repositoryClient.makePurchase({ userId, marketHashName }, (err, res) => {
            if (err) reject(err)
            else resolve(res)
        })
    })
}
