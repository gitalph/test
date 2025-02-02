import { ServerErrorResponse, status } from '@grpc/grpc-js'

export function handleError(
    error: unknown,
    logMessage: string,
    logger: { error: (message: string, meta?: Record<string, unknown>) => void },
    callback: (error: ServerErrorResponse) => void
): void {
    if (error instanceof Error) {
        logger.error(`${logMessage}: ${error.message}`, { stack: error.stack })
    } else {
        logger.error(`${logMessage}: Unknown error`)
    }
    callback({
        code: status.INTERNAL,
        message: 'Internal Server Error',
        name: 'InternalError'
    })
}
