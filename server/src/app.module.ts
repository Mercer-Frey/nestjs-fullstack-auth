import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

import { AuthModule } from '@/api/auth/auth.module'
import { PasswordRecoveryModule } from '@/api/auth/password-recovery/password-recovery.module'
import { ProviderModule } from '@/api/auth/provider/provider.module'
import { UserModule } from '@/api/user/user.module'
import { IS_DEV_ENV } from '@/libs/common/utils/is-dev.util'
import { SmtpModule } from '@/libs/smtp/smtp.module'
import { PrismaModule } from '@/prisma/prisma.module'

import { EmailConfirmModule } from './api/auth/email-confirm/email-confirm.module'

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			expandVariables: true,
			ignoreEnvFile: !IS_DEV_ENV
		}),
		PrismaModule,
		AuthModule,
		UserModule,
		ProviderModule,
		SmtpModule,
		EmailConfirmModule,
		PasswordRecoveryModule
	]
})
export class AppModule {}
