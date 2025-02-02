import { ServerUnaryCall, sendUnaryData } from '@grpc/grpc-js'
import { CreateProductRequest, CreateProductResponse, DeleteProductRequest, DeleteProductResponse, GetProductRequest, GetProductResponse, RepositoryServiceServer, UpdateProductRequest, UpdateProductResponse, UpdateUserBalanceRequest, UpdateUserBalanceResponse } from '../../generated/proto/repository.js'

import { GetUserHandler } from './auth/GetUser.js'
import { CreateUserHandler } from './auth/CreateUser.js'
import { GetUserByEmailHandler } from './auth/GetUserByEmail.js'
import { UpdateUserPasswordHandler } from './auth/UpdateUserPassword.js'

import { UpdateItemsHandler } from './collect-items/UpdateItems.js'
import { GetItemsHandler } from './collect-items/GetItems.js'
import { MakePurchaseHandler } from './purchases/MakePurchase.js'

export const repositoryServiceHandlers: RepositoryServiceServer = {
    getUser: GetUserHandler,
    createUser: CreateUserHandler,
    getUserByEmail: GetUserByEmailHandler,
    updateUserPassword: UpdateUserPasswordHandler,

    getItems: GetItemsHandler,
    updateItems: UpdateItemsHandler,

    makePurchase: MakePurchaseHandler,

    updateUserBalance: function (call: ServerUnaryCall<UpdateUserBalanceRequest, UpdateUserBalanceResponse>, callback: sendUnaryData<UpdateUserBalanceResponse>): void {
        throw new Error('Function not implemented.')
    },
    updateProduct: function (call: ServerUnaryCall<UpdateProductRequest, UpdateProductResponse>, callback: sendUnaryData<UpdateProductResponse>): void {
        throw new Error('Function not implemented.')
    },
    getProduct: function (call: ServerUnaryCall<GetProductRequest, GetProductResponse>, callback: sendUnaryData<GetProductResponse>): void {
        throw new Error('Function not implemented.')
    },
    createProduct: function (call: ServerUnaryCall<CreateProductRequest, CreateProductResponse>, callback: sendUnaryData<CreateProductResponse>): void {
        throw new Error('Function not implemented.')
    },
    deleteProduct: function (call: ServerUnaryCall<DeleteProductRequest, DeleteProductResponse>, callback: sendUnaryData<DeleteProductResponse>): void {
        throw new Error('Function not implemented.')
    }
}
