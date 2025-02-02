import { FastifyReply, FastifyRequest } from 'fastify'
import { AuthServiceClient, ValidateSessionResponse } from '../../generated/proto/auth.js'

/**
 * Middleware for session token validation.
 * If the token is missing or fails validation via gRPC, an error is sent.
 *
 * @param authClient gRPC client for the authentication service
 */
export const sessionValidator = (authClient: AuthServiceClient) => {
    return async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
        const sessionToken = request.headers['x-session-token'] as string

        if (!sessionToken) {
            reply.code(401).send({ error: 'Session token is required in the headers.' })
            return
        }

        const validateSession = (): Promise<ValidateSessionResponse> => {
            return new Promise((resolve, reject) => {
                authClient.validateSession({ sessionToken }, (err, response) => {
                    if (err) {
                        return reject(err)
                    }

                    resolve(response)
                })
            })
        }

        const result = await validateSession()

        if (!result.isValid) {
            reply.code(401).send({ error: 'Invalid session token' })
            return
        }

        request.user = { id: result.userId }
    }
}
