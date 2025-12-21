import {
	Body,
	Controller,
	HttpCode,
	HttpStatus,
	Post,
	Req,
	Res
} from '@nestjs/common'
import type { Request, Response } from 'express'

import { LoginDto, RegisterDto } from '@/api/auth/dto'

import { AuthService } from './auth.service'

@Controller('auth')
export class AuthController {
	public constructor(private readonly authService: AuthService) {}

	@Post('register')
	@HttpCode(HttpStatus.CREATED)
	public async register(@Req() req: Request, @Body() dto: RegisterDto) {
		return this.authService.register(req, dto)
	}

	@Post('login')
	@HttpCode(HttpStatus.OK)
	public async login(@Req() req: Request, @Body() dto: LoginDto) {
		return this.authService.login(req, dto)
	}

	@Post('logout')
	@HttpCode(HttpStatus.OK)
	public async logout(
		@Req() req: Request,
		@Res({ passthrough: true }) res: Response
	) {
		return this.authService.logout(req, res)
	}
}
