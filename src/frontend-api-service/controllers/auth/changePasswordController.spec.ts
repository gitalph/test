import { changePassword, ChangePasswordRequestBody } from './changePasswordController'
import { AuthServiceClient } from '../../../generated/proto/auth.js'
import { FastifyReply, FastifyRequest } from 'fastify'

describe('changePasswordController', () => {
    let mockAuthClient: Partial<AuthServiceClient>
    let mockRequest: Partial<FastifyRequest<{ Body: ChangePasswordRequestBody }>>
    let mockReply: Partial<FastifyReply>

    beforeEach(() => {
        mockAuthClient = {
            changePassword: jest.fn()
        }
        mockRequest = {
            body: { oldPassword: 'oldPass', newPassword: 'newPass' },
            user: { id: 1 }
        }
        mockReply = {
            code: jest.fn().mockReturnThis(),
            send: jest.fn()
        }
    })

    it('should change password successfully', async () => {
        (mockAuthClient.changePassword as jest.Mock).mockImplementation((_req, callback) => {
            callback(null)
        })
        //test
        await changePassword(mockRequest as FastifyRequest<{ Body: ChangePasswordRequestBody }>, mockReply as FastifyReply, mockAuthClient as AuthServiceClient)
        expect(mockReply.send).toHaveBeenCalledWith({ message: 'Password updated successfully' })
    })

    it('should handle same old and new password', async () => {
        mockRequest.body = { oldPassword: 'samepass', newPassword: 'samepass' }
        //test
        await changePassword(mockRequest as FastifyRequest<{ Body: ChangePasswordRequestBody }>, mockReply as FastifyReply, mockAuthClient as AuthServiceClient)
        expect(mockReply.code).toHaveBeenCalledWith(400)
        expect(mockReply.send).toHaveBeenCalledWith({ error: 'New password should be different from the old one' })
    })

    it('should handle validation error', async () => {
        mockRequest.body = { oldPassword: 'short', newPassword: 'short' }
        //test
        await changePassword(mockRequest as FastifyRequest<{ Body: ChangePasswordRequestBody }>, mockReply as FastifyReply, mockAuthClient as AuthServiceClient)
        expect(mockReply.code).toHaveBeenCalledWith(400)
        expect(mockReply.send).toHaveBeenCalledWith({
            error: 'Validation error',
            details: expect.any(Array)
        })
    })

    it('should handle error', async () => {
        (mockAuthClient.changePassword as jest.Mock).mockImplementation((_req, callback) => {
            callback({ code: 2 }) // status.UNKNOWN = 2
        })
        //test
        try {
            await changePassword(mockRequest as FastifyRequest<{ Body: ChangePasswordRequestBody }>, mockReply as FastifyReply, mockAuthClient as AuthServiceClient)
        } catch (e) {
            expect(e).toEqual({ code: 2 })
        }
        expect(mockReply.code).not.toHaveBeenCalled()
    })

    it('should handle missing session token', async () => {
        mockRequest.user = undefined
        //test
        await changePassword(mockRequest as FastifyRequest<{ Body: ChangePasswordRequestBody }>, mockReply as FastifyReply, mockAuthClient as AuthServiceClient)
        expect(mockReply.code).toHaveBeenCalledWith(401)
    })
})