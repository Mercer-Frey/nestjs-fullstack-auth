import { applyDecorators, UseGuards } from '@nestjs/common'
import { UserRole } from '@prisma/__generated__/enums'

import { Roles } from '@/libs/common/decorators'
import { AuthGuard, RolesGuard } from '@/libs/common/guards'

export function Authorization(...roles: UserRole[]) {
	if (roles.length > 0) {
		return applyDecorators(
			Roles(...roles),
			UseGuards(AuthGuard, RolesGuard)
		)
	}
	console.log('****************Authorization************************')
	console.log('roles', roles)
	console.log('****************Authorization************************')

	return applyDecorators(UseGuards(AuthGuard))
}
