import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

import { AuthModule } from '@/api/auth/auth.module'
import { UserModule } from '@/api/user/user.module'
import { IS_DEV_ENV } from '@/libs/common/utils/is-dev.util'
import { PrismaModule } from '@/prisma/prisma.module'

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			expandVariables: true,
			ignoreEnvFile: !IS_DEV_ENV
		}),
		PrismaModule,
		AuthModule,
		UserModule
	]
})
export class AppModule {}
