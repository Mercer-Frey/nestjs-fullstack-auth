import { ConfigService } from '@nestjs/config'
import { GoogleRecaptchaModuleOptions } from '@nestlab/google-recaptcha'

import { isDev } from '@/libs/common/utils'

export const getRecaptchaConfig = (
	configService: ConfigService
): GoogleRecaptchaModuleOptions => ({
	secretKey: configService.getOrThrow<string>('GOOGLE_RECAPTCHA_SECRET_KEY'),
	response: (req: Request): string | undefined =>
		req.headers['recaptcha'] as string | undefined,

	skipIf: isDev(configService)
})
