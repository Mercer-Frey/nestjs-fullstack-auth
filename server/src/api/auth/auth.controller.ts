import {
	BadRequestException,
	Body,
	Controller,
	Get,
	HttpCode,
	HttpStatus,
	Param,
	Post,
	Query,
	Req,
	Res,
	UseGuards
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Recaptcha } from '@nestlab/google-recaptcha'
import type { Request, Response } from 'express'

import { LoginDto, RegisterDto } from '@/api/auth/dto'
import { ProviderService } from '@/api/auth/provider/provider.service'
import { AuthProviderGuard } from '@/libs/common/guards'

import { AuthService } from './auth.service'

@Controller('auth')
export class AuthController {
	public constructor(
		private readonly authService: AuthService,
		private readonly providerService: ProviderService,
		private readonly configService: ConfigService
	) {}

	@Recaptcha()
	@Post('register')
	@HttpCode(HttpStatus.CREATED)
	public async register(@Req() req: Request, @Body() dto: RegisterDto) {
		return this.authService.register(req, dto)
	}

	@Recaptcha()
	@Post('login')
	@HttpCode(HttpStatus.OK)
	public async login(@Req() req: Request, @Body() dto: LoginDto) {
		return this.authService.login(req, dto)
	}

	@Get('/oauth/callback/:provider')
	@UseGuards(AuthProviderGuard)
	@HttpCode(HttpStatus.OK)
	public async callback(
		@Req() req: Request,
		@Res({ passthrough: true }) res: Response,
		@Query() query: Record<string, string | undefined>, // ← берём весь query объект
		@Param('provider') provider: string
	): Promise<void> {
		let codeOrQuery: string

		if (provider === 'steam') {
			// Для Steam: передаём весь query string как есть
			// req.url содержит путь + query, например: "/auth/oauth/callback/steam?openid.ns=...&openid.mode=..."
			const queryString = req.url.split('?')[1]

			if (!queryString) {
				throw new BadRequestException('Missing Steam OpenID parameters')
			}
			codeOrQuery = queryString
		} else {
			// Для остальных (Google, Discord) — стандартный code
			const code = query.code

			if (!code) {
				throw new BadRequestException('Invalid code')
			}
			codeOrQuery = code
		}

		await this.authService.extractProfileFromCode(
			req,
			provider,
			codeOrQuery
		)

		return res.redirect(
			`${this.configService.getOrThrow<string>('ALLOWED_ORIGIN')}/dashboard/settings`
		)
	}

	@Get('/oauth/connect/:provider')
	@UseGuards(AuthProviderGuard)
	@HttpCode(HttpStatus.OK)
	public connect(@Param('provider') provider: string): { url: string } {
		const providerInstance = this.providerService.findByService(provider)

		return {
			url: providerInstance.getAuthUrl()
		}
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
