import { Module } from '@nestjs/common'

import { TwoFactorAuthService } from '@/api/auth/two-factor-auth/two-factor-auth.service'
import { SmtpModule } from '@/libs/smtp/smtp.module'

@Module({
	imports: [SmtpModule],
	providers: [TwoFactorAuthService],
	exports: [TwoFactorAuthService]
})
export class TwoFactorAuthModule {}
