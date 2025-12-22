import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { GoogleRecaptchaModule } from '@nestlab/google-recaptcha'

import { UserService } from '@/api/user/user.service'
import { getRecaptchaConfig } from '@/config/recaptcha.config'

import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'

@Module({
	controllers: [AuthController],
	providers: [AuthService, UserService],
	imports: [
		GoogleRecaptchaModule.forRootAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: getRecaptchaConfig
		})
	]
})
export class AuthModule {}
