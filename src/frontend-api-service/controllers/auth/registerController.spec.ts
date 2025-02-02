// import { jest } from '@jest/globals'
import { register } from './registerController'
import { AuthServiceClient, RegisterRequest } from '../../../generated/proto/auth.js'
import { FastifyReply, FastifyRequest } from 'fastify'

describe('registerController', () => {
    let mockAuthClient: Partial<AuthServiceClient>
    let mockRequest: Partial<FastifyRequest<{ Body: RegisterRequest }>>
    let mockReply: Partial<FastifyReply>

    beforeEach(() => {
        mockAuthClient = {
            register: jest.fn()
        }
        mockRequest = {
            body: { email: 'test@example.com', password: 'test123', username: 'testuser' }
        }
        mockReply = {
            code: jest.fn().mockReturnThis(),
            send: jest.fn()
        }
    })

    it('should register user successfully', async () => {
        (mockAuthClient.register as jest.Mock).mockImplementation((_req, callback) => {
            callback(null, { message: 'User registered successfully' })
        })
        // test
        await register(mockRequest as FastifyRequest<{ Body: RegisterRequest }>, mockReply as FastifyReply, mockAuthClient as AuthServiceClient)
        expect(mockReply.send).toHaveBeenCalledWith({ message: 'User registered successfully' })
    })

    it('should handle ALREADY_EXISTS error', async () => {
        (mockAuthClient.register as jest.Mock).mockImplementation((_req, callback) => {
            callback({ code: 6 }, null) // status.ALREADY_EXISTS = 6
        })
        // test
        await register(mockRequest as FastifyRequest<{ Body: RegisterRequest }>, mockReply as FastifyReply, mockAuthClient as AuthServiceClient)
        expect(mockReply.code).toHaveBeenCalledWith(409)
    })

    it('should handle validation error', async () => {
        mockRequest.body = { email: 'invalid-email', password: 'short', username: 'us' }
        // test
        await register(mockRequest as FastifyRequest<{ Body: RegisterRequest }>, mockReply as FastifyReply, mockAuthClient as AuthServiceClient)
        expect(mockReply.code).toHaveBeenCalledWith(400)
        expect(mockReply.send).toHaveBeenCalledWith({
            error: 'Validation error',
            details: expect.any(Array)
        })
    })

    it('should handle unknown error', async () => {
        (mockAuthClient.register as jest.Mock).mockImplementation((_req, callback) => {
            callback({ code: 2 }, null) // status.UNKNOWN = 2
        })
        // test
        try {
            await register(mockRequest as FastifyRequest<{ Body: RegisterRequest }>, mockReply as FastifyReply, mockAuthClient as AuthServiceClient)
        } catch (e) {
            expect(e).toEqual({ code: 2 })
        }
        expect(mockReply.code).not.toHaveBeenCalled()
    })
})