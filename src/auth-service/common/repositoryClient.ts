import { credentials, status } from '@grpc/grpc-js'
import { CreateUserResponse, GetUserByEmailResponse, GetUserResponse, RepositoryServiceClient } from '../../generated/proto/repository.js'

export const repositoryClient = new RepositoryServiceClient(
    `${process.env.REPOSITORY_SERVICE_HOST}:${process.env.REPOSITORY_SERVICE_PORT}`,
    credentials.createInsecure()
)

export function getUserById(userId: number): Promise<GetUserResponse | null> {
    return new Promise((resolve, reject) => {
        repositoryClient.getUser({ userId }, (err, res) => {
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

export function getUserByEmail(email: string): Promise<GetUserByEmailResponse | null> {
    return new Promise((resolve, reject) => {
        repositoryClient.getUserByEmail({ email }, (err, res) => {
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

export function createUser(args: { username: string; email: string; passwordHash: string }): Promise<CreateUserResponse> {
    return new Promise((resolve, reject) => {
        repositoryClient.createUser(args, (err, res) => {
            if (err) reject(err)
            else resolve(res)
        })
    })
}

export function updateUserPassword(args: { userId: number; newPasswordHash: string }): Promise<void> {
    return new Promise((resolve, reject) => {
        repositoryClient.updateUserPassword(args, (err) => {
            if (err) reject(err)
            else resolve()
        })
    })
}
