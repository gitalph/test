import { randomUUID, UUID } from 'crypto'
import bcrypt from 'bcrypt'

export const uuidv4 = (): UUID => randomUUID()

export const verifyPasswordMismatch = async (password: string, hash: string): Promise<boolean> =>
    !(await bcrypt.compare(password, hash))


export const passwordHashing = async (password: string): Promise<string> =>
    bcrypt.hash(password, 10)
