import { credentials } from '@grpc/grpc-js'
import { promisify } from 'util'
import { RepositoryServiceClient, Item, UpdateItemsResponse } from '../generated/proto/repository.js'

const repositoryClient = new RepositoryServiceClient(
    `${process.env.REPOSITORY_SERVICE_HOST}:${process.env.REPOSITORY_SERVICE_PORT}`,
    credentials.createInsecure()
)

const updateItemsAsync = promisify(repositoryClient.updateItems.bind(repositoryClient)) as (args: { items: Item[] }) => Promise<UpdateItemsResponse>

export const saveItems = async (items: Item[]): Promise<UpdateItemsResponse> =>
    updateItemsAsync({ items })
