import { login } from './loginController'
import { AuthServiceClient, LoginRequest } from '../../../generated/proto/auth.js'
import { FastifyReply, FastifyRequest } from 'fastify'

describe('loginController', () => {
    let mockAuthClient: Partial<AuthServiceClient>
    let mockRequest: Partial<FastifyRequest<{ Body: LoginRequest }>>
    let mockReply: Partial<FastifyReply>

    beforeEach(() => {
        mockAuthClient = {
            login: jest.fn()
        }
        mockRequest = {
            body: { email: 'test@example.com', password: 'test123' }
        }

        mockReply = {
            code: jest.fn().mockReturnThis(),
            send: jest.fn()
        } as unknown as jest.Mocked<FastifyReply>
    })

    it('should log in user successfully', async () => {
        (mockAuthClient.login as jest.Mock).mockImplementation((_req, callback) => {
            callback(null, { sessionToken: 'test-token' })
        })

        await login(mockRequest as FastifyRequest<{ Body: LoginRequest }>, mockReply as FastifyReply, mockAuthClient as AuthServiceClient)

        expect(mockReply.code).toHaveBeenCalledWith(201)
        expect(mockReply.send).toHaveBeenCalledWith({ sessionToken: 'test-token' })
    })

    it('should return validation error', async () => {
        mockRequest.body = { email: 'invalid-email', password: 'short' }

        await login(mockRequest as FastifyRequest<{ Body: LoginRequest }>, mockReply as FastifyReply, mockAuthClient as AuthServiceClient)

        expect(mockReply.code).toHaveBeenCalledWith(400)
        expect(mockReply.send).toHaveBeenCalledWith({
            error: 'Validation error',
            details: expect.any(Array)
        })
    })

    it('should handle NOT_FOUND error', async () => {
        (mockAuthClient.login as jest.Mock).mockImplementation((_req, callback) => {
            callback({ code: 5 }, null) // status.NOT_FOUND = 5
        })
        // test
        await login(mockRequest as FastifyRequest<{ Body: LoginRequest }>, mockReply as FastifyReply, mockAuthClient as AuthServiceClient)

        expect(mockReply.code).toHaveBeenCalledWith(401)
    })

    it('should handle UNAUTHENTICATED error', async () => {
        (mockAuthClient.login as jest.Mock).mockImplementation((_req, callback) => {
            callback({ code: 16 }, null) // status.UNAUTHENTICATED = 16
        })
        // test
        await login(mockRequest as FastifyRequest<{ Body: LoginRequest }>, mockReply as FastifyReply, mockAuthClient as AuthServiceClient)

        expect(mockReply.code).toHaveBeenCalledWith(401)
    })

    it('should handle unknown error', async () => {
        (mockAuthClient.login as jest.Mock).mockImplementation((_req, callback) => {
            callback({ code: 2 }, null) // status.UNKNOWN = 2
        })
        // test
        try {
            await login(mockRequest as FastifyRequest<{ Body: LoginRequest }>, mockReply as FastifyReply, mockAuthClient as AuthServiceClient)
        } catch (e) {
            expect(e).toEqual({ code: 2 })
        }
        expect(mockReply.code).not.toHaveBeenCalled()
    })

})
