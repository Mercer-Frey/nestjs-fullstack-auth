import {
	forwardRef,
	Inject,
	Injectable,
	NotFoundException,
	UnauthorizedException
} from '@nestjs/common'
import { User } from '@prisma/__generated__/client'
import { TokenType } from '@prisma/__generated__/enums'
import type { Request } from 'express'
import { v4 as uuidv4 } from 'uuid'

import { AuthService } from '@/api/auth/auth.service'
import { EmailConfirmDto } from '@/api/auth/email-confirm/dto'
import { UserService } from '@/api/user/user.service'
import { SmtpService } from '@/libs/smtp/smtp.service'
import { PrismaService } from '@/prisma/prisma.service'

@Injectable()
export class EmailConfirmService {
	public constructor(
		@Inject(forwardRef(() => AuthService))
		private readonly authService: AuthService,
		private readonly prismaService: PrismaService,
		private readonly smtpService: SmtpService,
		private readonly userService: UserService
	) {}

	public async newVerification(req: Request, dto: EmailConfirmDto) {
		const existedToken = await this.prismaService.token.findUnique({
			where: { token: dto.token, type: TokenType.VERIFICATION }
		})

		if (!existedToken) {
			throw new NotFoundException(`Token with id ${dto.token} not found`)
		}

		const isExpired = new Date(existedToken.expiresIn) < new Date()

		if (isExpired) {
			throw new UnauthorizedException(
				`Token with id ${dto.token} not found`
			)
		}

		const existedUser = await this.userService.findByEmail(
			existedToken.email
		)

		if (!existedUser) {
			throw new NotFoundException(
				`User with email ${existedToken.email} not found`
			)
		}

		const updatedUser = await this.prismaService.user.update({
			where: {
				id: existedUser.id
			},
			data: {
				isVerified: true
			}
		})

		await this.prismaService.token.delete({
			where: {
				id: existedToken.id,
				type: TokenType.VERIFICATION
			}
		})

		return this.authService.saveSession(req, updatedUser)
	}

	public async sendVerificationToken(user: User) {
		const verificationToken = await this.generateVerificationToken(
			user.email
		)

		await this.smtpService.sendConfirmationEmail(
			verificationToken.email,
			verificationToken.token
		)

		return true
	}

	private async generateVerificationToken(email: string) {
		const token = uuidv4()
		const expiresIn = new Date(Date.now() + 60 * 60 * 1000)
		const existedToken = await this.prismaService.token.findFirst({
			where: { email, type: TokenType.VERIFICATION }
		})

		if (existedToken) {
			await this.prismaService.token.delete({
				where: {
					id: existedToken.id,
					type: TokenType.VERIFICATION
				}
			})
		}

		const verificationToken = await this.prismaService.token.create({
			data: {
				email,
				token,
				expiresIn,
				type: TokenType.VERIFICATION
			}
		})

		return verificationToken
	}
}
