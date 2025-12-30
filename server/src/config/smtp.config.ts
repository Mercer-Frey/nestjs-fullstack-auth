import { MailerOptions } from '@nestjs-modules/mailer'
import { ConfigService } from '@nestjs/config'

import { isDev } from '@/libs/common/utils'

export const getSMTPConfig = (configService: ConfigService): MailerOptions => ({
	transport: {
		...config(configService),
		host: configService.getOrThrow<string>('MAIL_HOST'),
		auth: {
			user: configService.getOrThrow<string>('MAIL_USER'),
			pass: configService.getOrThrow<string>('MAIL_PASS')
		}
	},
	defaults: {
		from: `"Mercer Frey" <${configService.getOrThrow<string>('MAIL_FROM')}>`
	}
})

const config = (configService: ConfigService) => {
	return isDev(configService)
		? {
				port: 587,
				secure: false,
				requireTLS: true
			}
		: {
				port: Number(configService.getOrThrow<string>('MAIL_PORT')),
				secure: !isDev(configService)
			}
}
