import { DynamicModule, Module } from '@nestjs/common'

import { ProviderService } from '@/api/auth/provider/provider.service'
import { ProviderOptionsToken } from '@/api/auth/provider/tokens'
import { TypeAsyncOptions, TypeOptions } from '@/api/auth/provider/types'

@Module({})
export class ProviderModule {
	public static register(options: TypeOptions): DynamicModule {
		return {
			module: ProviderModule,
			providers: [
				{
					useValue: options.services,
					provide: ProviderOptionsToken
				},
				ProviderService
			],
			exports: [ProviderService]
		}
	}

	public static registerAsync(
		options: TypeAsyncOptions
	): DynamicModule | null {
		return {
			module: ProviderModule,
			imports: options.imports,
			providers: [
				{
					useFactory: options.useFactory,
					provide: ProviderOptionsToken,
					inject: options.inject
				},
				ProviderService
			],
			exports: [ProviderService]
		}
	}
}
