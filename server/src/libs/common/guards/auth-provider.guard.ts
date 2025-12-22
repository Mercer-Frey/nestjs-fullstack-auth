import {
	CanActivate,
	ExecutionContext,
	Injectable,
	NotFoundException
} from '@nestjs/common'

import { ProviderService } from '@/api/auth/provider/provider.service'
import { RequestWithUser } from '@/libs/common/interfaces'

@Injectable()
export class AuthProviderGuard implements CanActivate {
	public constructor(private readonly providerService: ProviderService) {}

	canActivate(context: ExecutionContext): boolean {
		const request = context.switchToHttp().getRequest<RequestWithUser>()
		const provider = request.params.provider
		const providerInstance = this.providerService.findByService(provider)

		if (!providerInstance) {
			throw new NotFoundException('Provider Not Found')
		}

		return true
	}
}
