import {
	Body,
	Controller,
	HttpCode,
	HttpStatus,
	Post,
	Req
} from '@nestjs/common'
import type { Request } from 'express'

import { EmailConfirmDto } from '@/api/auth/email-confirm/dto'

import { EmailConfirmService } from './email-confirm.service'

@Controller('auth/email-confirmation')
export class EmailConfirmController {
	constructor(private readonly emailConfirmService: EmailConfirmService) {}

	@Post()
	@HttpCode(HttpStatus.OK)
	public async newVerification(
		@Req() req: Request,
		@Body() dto: EmailConfirmDto
	) {
		return this.emailConfirmService.newVerification(req, dto)
	}
}
