import { Module } from '@nestjs/common'

import { UserModule } from '@/api/user/user.module'
import { SmtpModule } from '@/libs/smtp/smtp.module'
import { PrismaModule } from '@/prisma/prisma.module'

import { PasswordRecoveryController } from './password-recovery.controller'
import { PasswordRecoveryService } from './password-recovery.service'

@Module({
	imports: [UserModule, PrismaModule, SmtpModule],
	controllers: [PasswordRecoveryController],
	providers: [PasswordRecoveryService]
})
export class PasswordRecoveryModule {}
