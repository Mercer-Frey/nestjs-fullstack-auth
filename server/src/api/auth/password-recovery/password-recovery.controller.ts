import { Body, Controller, HttpCode, Param, Post } from '@nestjs/common'
import { Recaptcha } from '@nestlab/google-recaptcha'

import {
	NewPasswordDto,
	ResetPasswordDto
} from '@/api/auth/password-recovery/dto'

import { PasswordRecoveryService } from './password-recovery.service'

@Controller('auth/password-recovery')
export class PasswordRecoveryController {
	constructor(
		private readonly passwordRecoveryService: PasswordRecoveryService
	) {}

	@Recaptcha()
	@Post('reset')
	@HttpCode(200)
	public async resetPassword(@Body() dto: ResetPasswordDto) {
		return this.passwordRecoveryService.reset(dto)
	}

	@Recaptcha()
	@Post('new/:token')
	@HttpCode(200)
	public async newPassword(
		@Body() dto: NewPasswordDto,
		@Param('token') token: string
	) {
		return this.passwordRecoveryService.newPassword(dto, token)
	}
}
