import { MailerService } from '@nestjs-modules/mailer'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { render } from '@react-email/render'
import type { SentMessageInfo } from 'nodemailer'

import ConfirmationTemplate from '@/libs/smtp/templates/confirmation.template'
import { ResetPasswordTemplateProps } from '@/libs/smtp/templates/props/reset-password-template-props.interface'
import { TwoFactorAuthTemplateProps } from '@/libs/smtp/templates/props/two-factor-auth-template-props.interface'
import ResetPasswordTemplate from '@/libs/smtp/templates/reset-password.template'
import TwoFactorAuthTemplate from '@/libs/smtp/templates/two-factor-auth.template'

interface ConfirmationTemplateProps {
	token: string
	domain: string
}

@Injectable()
export class SmtpService {
	public constructor(
		private readonly mailerService: MailerService,
		private readonly configService: ConfigService
	) {}

	public async sendConfirmationEmail(
		email: string,
		token: string
	): Promise<void> {
		const domain = this.configService.getOrThrow<string>('ALLOWED_ORIGIN')

		const html: string = await render(
			ConfirmationTemplate({ domain, token } as ConfirmationTemplateProps)
		)

		await this.sendMail(email, 'Confirm your email address', html)
	}

	public async sendPasswordResetEmail(
		email: string,
		token: string
	): Promise<void> {
		const domain = this.configService.getOrThrow<string>('ALLOWED_ORIGIN')

		const html: string = await render(
			ResetPasswordTemplate({
				domain,
				token
			} as ResetPasswordTemplateProps)
		)

		await this.sendMail(email, 'Reset password', html)
	}

	public async sendTwoFactorAuthEmail(
		email: string,
		token: string
	): Promise<void> {
		const html: string = await render(
			TwoFactorAuthTemplate({
				token
			} as TwoFactorAuthTemplateProps)
		)

		await this.sendMail(email, 'Confirm your personality', html)
	}

	private async sendMail(
		to: string,
		subject: string,
		html: string
	): Promise<SentMessageInfo> {
		return this.mailerService.sendMail({ to, subject, html })
	}
}
