import { FastifyInstance } from 'fastify'
import { register } from '../controllers/auth/registerController.js'
import { AuthServiceClient, LoginRequest, RegisterRequest } from '../../generated/proto/auth.js'
import { login } from '../controllers/auth/loginController.js'
import { changePassword, ChangePasswordRequestBody } from '../controllers/auth/changePasswordController.js'
import { sessionValidator } from '../middlewares/sessionValidator.js'

interface AuthRouteOptions {
    authClient: AuthServiceClient;
}

export const authRoutes = async (app: FastifyInstance, options: AuthRouteOptions): Promise<void> => {
    const { authClient } = options

    app.post<{ Body: RegisterRequest }>(
        '/register',
        {
            schema: {
                body: {
                    type: 'object',
                    properties: {
                        username: { type: 'string', description: 'Username for registration' },
                        email: { type: 'string', format: 'email', description: 'User email address' },
                        password: { type: 'string', minLength: 6, description: 'Password (min 6 characters)' }
                    },
                    required: ['username', 'email', 'password']
                },
                response: {
                    200: {
                        type: 'object',
                        properties: {
                            sessionToken: { type: 'string' }
                        }
                    }
                }
            }
        },
        async (request, reply) => register(request, reply, authClient)
    )

    app.post<{ Body: LoginRequest }>(
        '/login',
        {
            schema: {
                body: {
                    type: 'object',
                    properties: {
                        email: { type: 'string', format: 'email', description: 'Registered email address' },
                        password: { type: 'string', description: 'Password' }
                    },
                    required: ['email', 'password']
                },
                response: {
                    201: {
                        type: 'object',
                        properties: {
                            sessionToken: { type: 'string' },
                            username: { type: 'string' },
                            balance: { type: 'number' }
                        }
                    }
                }
            }
        },
        async (request, reply) => login(request, reply, authClient)
    )

    app.put<{ Body: ChangePasswordRequestBody }>(
        '/change-password',
        {
            preHandler: sessionValidator(authClient),
            schema: {
                headers: {
                    type: 'object',
                    properties: {
                        'x-session-token': { type: 'string', description: 'Session token for authorization' }
                    },
                    required: ['x-session-token']
                },
                body: {
                    type: 'object',
                    properties: {
                        oldPassword: { type: 'string', minLength: 6, description: 'Current password' },
                        newPassword: { type: 'string', minLength: 6, description: 'New password (min 6 characters)' }
                    },
                    required: ['oldPassword', 'newPassword']
                },
                response: {
                    200: {
                        type: 'object',
                        properties: {
                            message: { type: 'string' }
                        }
                    }
                }
            }
        },
        async (request, reply) => changePassword(request, reply, authClient)
    )
}
