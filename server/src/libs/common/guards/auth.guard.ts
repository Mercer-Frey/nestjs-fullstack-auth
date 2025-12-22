import {
	CanActivate,
	ExecutionContext,
	Injectable,
	UnauthorizedException
} from '@nestjs/common'

import { UserService } from '@/api/user/user.service'
import { RequestWithUser } from '@/libs/common/interfaces'

@Injectable()
export class AuthGuard implements CanActivate {
	public constructor(private readonly userService: UserService) {}

	public async canActivate(context: ExecutionContext): Promise<boolean> {
		const request = context.switchToHttp().getRequest<RequestWithUser>()

		if (typeof request.session.userId === 'undefined') {
			throw new UnauthorizedException('Unauthorized')
		}

		const user = await this.userService.findById(request.session.userId)

		if (!user) {
			throw new UnauthorizedException('Unauthorized')
		}

		request.user = user

		// console.log('****************AuthGuard************************')
		// console.log('request.session', request.session)
		// console.log('context', context)
		// console.log('user', user)
		// console.log('****************AuthGuard************************')

		return true
	}
}
