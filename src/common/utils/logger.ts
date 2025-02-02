import { createLogger, format, transports, Logger } from 'winston'

import * as path from 'path'

import 'dotenv/config'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const logLevel: string = process.env.LOG_LEVEL || 'info'

const logFormat = format.combine(
    format.timestamp({
        format: 'YYYY-MM-DD HH:mm:ss'
    }),
    format.errors({ stack: true }),
    format.splat(),
    format.json()
)

const logger: Logger = createLogger({
    level: logLevel,
    format: logFormat,
    transports: [
        new transports.Console({
            format: format.combine(
                format.colorize(),
                format.printf(({ timestamp, level, message, ...meta }) => {
                    let log = `${timestamp} [${level}]: ${message}`
                    if (Object.keys(meta).length > 0) {
                        log += ` ${JSON.stringify(meta)}`
                    }
                    return log
                })
            )
        }),
        new transports.File({
            filename: path.join(__dirname, '../../logs/error.log'),
            level: 'error',
            format: format.combine(
                format.timestamp({
                    format: 'YYYY-MM-DD HH:mm:ss'
                }),
                format.json()
            )
        }),
        new transports.File({
            filename: path.join(__dirname, '../../logs/combined.log'),
            format: format.combine(
                format.timestamp({
                    format: 'YYYY-MM-DD HH:mm:ss'
                }),
                format.json()
            )
        })
    ],
    exceptionHandlers: [
        new transports.File({ filename: path.join(__dirname, '../../logs/exceptions.log') })
    ],
    rejectionHandlers: [
        new transports.File({ filename: path.join(__dirname, '../../logs/rejections.log') })
    ],
    exitOnError: false
})

export default logger
