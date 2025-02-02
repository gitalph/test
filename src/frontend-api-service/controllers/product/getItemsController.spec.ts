import { getItems } from './getItemsController'
import { GetItemsRequest, ProductServiceClient } from '../../../generated/proto/product.js'
import { FastifyReply, FastifyRequest } from 'fastify'

describe('getItemsController', () => {
    let mockProductClient: Partial<ProductServiceClient>
    let mockRequest: Partial<FastifyRequest>
    let mockReply: Partial<FastifyReply>

    beforeEach(() => {
        mockProductClient = {
            getItems: jest.fn()
        }
        mockRequest = {
            query: { page: 1, pageSize: 10 }
        }
        mockReply = {
            code: jest.fn().mockReturnThis(),
            send: jest.fn()
        }
    })

    it('should get items successfully with correct price', async () => {
        const mockResponse = {
            items: [{
                marketHashName: 'Item One',
                tradableMinPrice: 10,
                minPrice: 0.50
            }],
            total: 1
        };
        (mockProductClient.getItems as jest.Mock).mockImplementation((_req, callback) => {
            callback(null, {
                total: mockResponse.total,
                items: mockResponse.items.map(item => ({
                    ...item,
                    // price stored in cents
                    tradableMinPrice: item.tradableMinPrice * 100,
                    minPrice: item.minPrice * 100
                }))
            })
        })
        await getItems(
            mockRequest as FastifyRequest<{ Body: GetItemsRequest }>,
            mockReply as FastifyReply,
            mockProductClient as ProductServiceClient
        )
        expect(mockReply.send).toHaveBeenCalledWith(mockResponse)
    })

    it('should get items successfully with null price', async () => {
        const mockResponse = { items: [{ marketHashName: 'Item One', minPrice: null, tradableMinPrice: null }], total: 1 };
        (mockProductClient.getItems as jest.Mock).mockImplementation((_req, callback) => {
            callback(null, mockResponse)
        })
        await getItems(
            mockRequest as FastifyRequest<{ Body: GetItemsRequest }>,
            mockReply as FastifyReply,
            mockProductClient as ProductServiceClient
        )
        expect(mockReply.send).toHaveBeenCalledWith(mockResponse)
    })

    it('should handle validation error', async () => {
        // invalid query: non-numeric page
        mockRequest.query = { page: 'NaN', pageSize: 10 }
        await getItems(
            mockRequest as FastifyRequest<{ Body: GetItemsRequest }>,
            mockReply as FastifyReply,
            mockProductClient as ProductServiceClient
        )
        expect(mockReply.code).toHaveBeenCalledWith(400)
        expect(mockReply.send).toHaveBeenCalledWith({
            error: 'Validation error',
            details: expect.any(Array)
        })
    })

    it('should handle error from productClient', async () => {
        const errorObj = { code: 2 }; // status.UNKNOWN = 2
        (mockProductClient.getItems as jest.Mock).mockImplementation((_req, callback) => {
            callback(errorObj)
        })
        await expect(
            getItems(
                mockRequest as FastifyRequest<{ Body: GetItemsRequest }>,
                mockReply as FastifyReply,
                mockProductClient as ProductServiceClient
            )
        ).rejects.toEqual(errorObj)
    })
})
