import { UserRole } from '@prisma/__generated__/enums'
import type { Request } from 'express'

export interface RequestWithUser extends Request {
	user: {
		role: UserRole
	}
}
