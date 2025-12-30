import {
	BadRequestException,
	Injectable,
	NotFoundException,
	UnauthorizedException
} from '@nestjs/common'
import { TokenType } from '@prisma/__generated__/enums'

import { SmtpService } from '@/libs/smtp/smtp.service'
import { PrismaService } from '@/prisma/prisma.service'

@Injectable()
export class TwoFactorAuthService {
	public constructor(
		private readonly smtpService: SmtpService,
		private readonly prismaService: PrismaService
	) {}

	public async validateTwoFactorToken(email: string, code: string) {
		const existedToken = await this.prismaService.token.findFirst({
			where: { email, type: TokenType.TWO_FACTOR }
		})

		if (!existedToken) {
			throw new NotFoundException(`Token for email ${email} not found`)
		}

		if (existedToken.token !== code) {
			throw new BadRequestException(`Code is not correct: ${code}`)
		}

		const isExpired = new Date(existedToken.expiresIn) < new Date()

		if (isExpired) {
			throw new UnauthorizedException(
				`Token for email ${email} not found`
			)
		}

		await this.prismaService.token.delete({
			where: {
				id: existedToken.id,
				type: TokenType.TWO_FACTOR
			}
		})

		return true
	}

	public async sendTwoFactorAuthToken(email: string) {
		const twoFactorAuthToken = await this.generateTwoFactorAuthToken(email)

		await this.smtpService.sendTwoFactorAuthEmail(
			twoFactorAuthToken.email,
			twoFactorAuthToken.token
		)

		return true
	}

	private async generateTwoFactorAuthToken(email: string) {
		const token = Math.floor(
			Math.random() * (1000000 - 100000) + 100000
		).toString()
		const expiresIn = new Date(Date.now() + 60 * 15 * 1000)
		const existedToken = await this.prismaService.token.findFirst({
			where: { email, type: TokenType.TWO_FACTOR }
		})

		if (existedToken) {
			await this.prismaService.token.delete({
				where: {
					id: existedToken.id,
					type: TokenType.TWO_FACTOR
				}
			})
		}

		const twoFactorToken = await this.prismaService.token.create({
			data: {
				email,
				token,
				expiresIn,
				type: TokenType.TWO_FACTOR
			}
		})

		return twoFactorToken
	}
}
