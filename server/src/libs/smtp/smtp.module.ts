import { MailerModule } from '@nestjs-modules/mailer'
import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'

import { getSMTPConfig } from '@/config/smtp.config'

import { SmtpService } from './smtp.service'

@Module({
	imports: [
		MailerModule.forRootAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: getSMTPConfig
		})
	],
	exports: [SmtpService],
	providers: [SmtpService]
})
export class SmtpModule {}
