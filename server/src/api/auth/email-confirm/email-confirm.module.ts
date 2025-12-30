import { forwardRef, Module } from '@nestjs/common'

import { AuthModule } from '@/api/auth/auth.module'
import { UserModule } from '@/api/user/user.module'
import { SmtpModule } from '@/libs/smtp/smtp.module'

import { EmailConfirmController } from './email-confirm.controller'
import { EmailConfirmService } from './email-confirm.service'

@Module({
	imports: [SmtpModule, UserModule, forwardRef(() => AuthModule)],
	controllers: [EmailConfirmController],
	providers: [EmailConfirmService],
	exports: [EmailConfirmService]
})
export class EmailConfirmModule {}
