import { forwardRef, Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { GoogleRecaptchaModule } from '@nestlab/google-recaptcha'

import { EmailConfirmModule } from '@/api/auth/email-confirm/email-confirm.module'
import { ProviderModule } from '@/api/auth/provider/provider.module'
import { UserModule } from '@/api/user/user.module'
import { getProvidersConfig, getRecaptchaConfig } from '@/config'

import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { TwoFactorAuthModule } from './two-factor-auth/two-factor-auth.module'

@Module({
	controllers: [AuthController],
	providers: [AuthService],
	imports: [
		UserModule,
		GoogleRecaptchaModule.forRootAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: getRecaptchaConfig
		}),
		ProviderModule.registerAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: getProvidersConfig
		}),
		forwardRef(() => EmailConfirmModule),
		TwoFactorAuthModule
	],
	exports: [AuthService]
})
export class AuthModule {}
