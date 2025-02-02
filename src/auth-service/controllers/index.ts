import { AuthServiceServer } from '../../generated/proto/auth.js'
import { RegisterHandler } from './RegisterHandler.js'
import { LoginHandler } from './LoginHandler.js'
import { ChangePasswordHandler } from './ChangePasswordHandler.js'
import { ValidateSessionHandler } from './ValidateSessionHandler.js'

export const authServiceHandlers: AuthServiceServer = {
    register: RegisterHandler,
    login: LoginHandler,
    changePassword: ChangePasswordHandler,
    validateSession: ValidateSessionHandler
}
