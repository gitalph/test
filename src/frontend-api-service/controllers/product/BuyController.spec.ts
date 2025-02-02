import { ProductServiceClient } from '../../../generated/proto/product'
import { buy } from './BuyController'
import { FastifyRequest, FastifyReply } from 'fastify'

describe('buy controller', () => {
    let mockProductClient: Partial<ProductServiceClient>
    let mockRequest: Partial<FastifyRequest<{ Body: { marketHashName: string } }>>
    let mockReply: Partial<FastifyReply>

    beforeEach(() => {
        mockProductClient = {
            purchaseItem: jest.fn()
        }
        mockReply = {
            send: jest.fn(),
            code: jest.fn().mockReturnThis()
        }
        // Setting a valid user in request
        mockRequest = {
            user: { id: 1 },
            query: { marketHashName: 'testItem' }
        }
    })

    it('should send updated balance on successful purchase', async () => {
        const updatedBalance = 80;
        // mock callback calling success path
        (mockProductClient.purchaseItem as jest.Mock).mockImplementation((req, callback) => {
            callback(null, { updatedBalance })
        })

        await expect(buy(mockRequest as FastifyRequest<{ Body: { marketHashName: string } }>, mockReply as FastifyReply, mockProductClient as ProductServiceClient)).resolves.toBeUndefined()

        expect(mockProductClient.purchaseItem).toHaveBeenCalledWith(
            { userId: 1, marketHashName: 'testItem' },
            expect.any(Function)
        )
        expect(mockReply.send).toHaveBeenCalledWith({ updatedBalance })
    })

    it('should return validation error when marketHashName is missing', async () => {
        // simulate missing marketHashName in query
        mockRequest.query = {}
        await buy(mockRequest as FastifyRequest<{ Body: { marketHashName: string } }>, mockReply as FastifyReply, mockProductClient as ProductServiceClient)

        expect(mockReply.code).toHaveBeenCalledWith(400)
        expect(mockReply.send).toHaveBeenCalledWith(expect.objectContaining({
            error: 'Validation error'
        }))
    })

    it('should reject with error from productClient', async () => {
        const testError = new Error('Purchase failed');
        (mockProductClient.purchaseItem as jest.Mock).mockImplementation((req, callback) => {
            callback(testError)
        })

        await expect(buy(mockRequest as FastifyRequest<{ Body: { marketHashName: string } }>, mockReply as FastifyReply, mockProductClient as ProductServiceClient))
            .rejects.toEqual(testError)
    })

    it('should handle missing user in request', async () => {
        mockRequest.user = undefined
        await buy(mockRequest as FastifyRequest<{ Body: { marketHashName: string } }>, mockReply as FastifyReply, mockProductClient as ProductServiceClient)

        expect(mockReply.code).toHaveBeenCalledWith(401)
    })
})
