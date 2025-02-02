import { sessionValidator } from './sessionValidator'
import { AuthServiceClient } from '../../generated/proto/auth.js'
import { FastifyReply, FastifyRequest } from 'fastify'

describe('sessionValidator', () => {
    let mockAuthClient: Partial<AuthServiceClient>
    let mockRequest: Partial<FastifyRequest>
    let mockReply: Partial<FastifyReply>

    beforeEach(() => {
        mockAuthClient = {
            validateSession: jest.fn()
        }
        mockRequest = {
            body: { oldPassword: 'oldPass', newPassword: 'newPass' }
        }
        mockReply = {
            code: jest.fn().mockReturnThis(),
            send: jest.fn()
        }
    })

    it('should handle missing session token', async () => {
        mockRequest.headers = {}
        //test
        await sessionValidator(mockAuthClient as AuthServiceClient)(mockRequest as FastifyRequest, mockReply as FastifyReply)
        expect(mockReply.code).toHaveBeenCalledWith(401)
        expect(mockReply.send).toHaveBeenCalledWith({ error: 'Session token is required in the headers.' })
    })

    it('should handle invalid session token', async () => {
        mockRequest.headers = { 'x-session-token': 'invalid' };
        (mockAuthClient.validateSession as jest.Mock).mockImplementation((_req, callback) => {
            callback(null, { isValid: false })
        })
        //test
        await sessionValidator(mockAuthClient as AuthServiceClient)(mockRequest as FastifyRequest, mockReply as FastifyReply)
        expect(mockReply.code).toHaveBeenCalledWith(401)
        expect(mockReply.send).toHaveBeenCalledWith({ error: 'Invalid session token' })
    })

    it('should handle error from authClient', async () => {
        mockRequest.headers = { 'x-session-token': 'valid' };
        (mockAuthClient.validateSession as jest.Mock).mockImplementation((_req, callback) => {
            callback({ code: 2 }) // status.UNKNOWN = 2
        })
        //test
        try {
            await sessionValidator(mockAuthClient as AuthServiceClient)(mockRequest as FastifyRequest, mockReply as FastifyReply)
        } catch (e) {
            expect(e).toEqual({ code: 2 })
        }
        expect(mockReply.code).not.toHaveBeenCalled()
    })

    it('should set user id in request', async () => {
        mockRequest.headers = { 'x-session-token': 'valid' };
        (mockAuthClient.validateSession as jest.Mock).mockImplementation((_req, callback) => {
            callback(null, { isValid: true, userId: 1 })
        })
        //test
        await sessionValidator(mockAuthClient as AuthServiceClient)(mockRequest as FastifyRequest, mockReply as FastifyReply)
        expect(mockRequest.user).toEqual({ id: 1 })
    })
})
