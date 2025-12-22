import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { User } from '@prisma/__generated__/client'

import { RequestWithUser } from '@/libs/common/interfaces'

export const Authorized = createParamDecorator(
	(data: keyof User, ctx: ExecutionContext) => {
		const request = ctx.switchToHttp().getRequest<RequestWithUser>()
		const user = request.user as User
		console.log('****************Authorized************************')
		console.log('user', user)
		console.log('****************Authorized************************')

		return user ? user[data] : user
	}
)
