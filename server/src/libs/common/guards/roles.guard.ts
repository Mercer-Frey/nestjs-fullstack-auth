import {
	CanActivate,
	ExecutionContext,
	ForbiddenException,
	Injectable
} from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { UserRole } from '@prisma/__generated__/enums'

import { ROLES_KEY } from '@/libs/common/decorators'
import { RequestWithUser } from '@/libs/common/interfaces'

@Injectable()
export class RolesGuard implements CanActivate {
	public constructor(private readonly reflector: Reflector) {}

	canActivate(context: ExecutionContext): boolean {
		const roles = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [
			context.getHandler(),
			context.getClass()
		])

		if (!roles) return true

		const request = context.switchToHttp().getRequest<RequestWithUser>()

		if (!roles.includes(request.user.role)) {
			throw new ForbiddenException('No rights to access')
		}

		// console.log('****************RolesGuard************************')
		// console.log('roles', roles)
		// console.log('context', context)
		// console.log('context.getHandler()', context.getHandler())
		// console.log('context.getClass()', context.getClass())
		// console.log('request', request)
		// console.log('****************RolesGuard************************')

		return true
	}
}
