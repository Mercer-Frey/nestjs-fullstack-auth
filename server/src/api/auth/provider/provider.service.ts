import { Inject, Injectable, OnModuleInit } from '@nestjs/common'

import { BaseOAuthService } from '@/api/auth/provider/service/base-oauth.service'
import { ProviderOptionsToken } from '@/api/auth/provider/tokens'
import type { TypeOptions } from '@/api/auth/provider/types'

@Injectable()
export class ProviderService implements OnModuleInit {
	public constructor(
		@Inject(ProviderOptionsToken) private readonly options: TypeOptions
	) {}

	onModuleInit(): any {
		for (const provider of this.options.services) {
			provider.baseUrl = this.options.baseUrl
		}
	}

	public findByService(service: string): BaseOAuthService | null {
		return this.options.services.find(s => s.name === service)
	}
}
