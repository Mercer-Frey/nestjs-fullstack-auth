import {
	Injectable,
	NotFoundException,
	UnauthorizedException
} from '@nestjs/common'
import { TokenType } from '@prisma/__generated__/enums'
import { hash } from 'argon2'
import { v4 as uuidv4 } from 'uuid'

import {
	NewPasswordDto,
	ResetPasswordDto
} from '@/api/auth/password-recovery/dto'
import { UserService } from '@/api/user/user.service'
import { SmtpService } from '@/libs/smtp/smtp.service'
import { PrismaService } from '@/prisma/prisma.service'

@Injectable()
export class PasswordRecoveryService {
	public constructor(
		private readonly prismaService: PrismaService,
		private readonly smtpService: SmtpService,
		private readonly userService: UserService
	) {}

	public async reset(dto: ResetPasswordDto): Promise<boolean> {
		const user = await this.userService.findByEmail(dto.email)

		if (!user) {
			throw new NotFoundException('User not found')
		}

		const token = await this.generatePasswordResetToken(user.email)

		await this.smtpService.sendPasswordResetEmail(token.email, token.token)

		return true
	}

	public async newPassword(
		dto: NewPasswordDto,
		token: string
	): Promise<boolean> {
		const existedToken = await this.prismaService.token.findFirst({
			where: {
				token,
				type: TokenType.PASSWORD_RESET
			}
		})

		if (!existedToken) {
			throw new NotFoundException('Token not found')
		}

		const isExpired = new Date(existedToken.expiresIn) < new Date()

		if (isExpired) {
			throw new UnauthorizedException(`Token with id ${token} not found`)
		}

		const user = await this.userService.findByEmail(existedToken.email)

		if (!user) {
			throw new NotFoundException(
				`User with email ${existedToken.email} not found`
			)
		}

		await this.prismaService.user.update({
			where: {
				id: user.id
			},
			data: {
				password: await hash(dto.password)
			}
		})

		await this.prismaService.token.delete({
			where: {
				id: existedToken.id,
				type: TokenType.PASSWORD_RESET
			}
		})

		return true
	}

	private async generatePasswordResetToken(email: string) {
		const token = uuidv4()
		const expiresIn = new Date(Date.now() + 60 * 60 * 1000)
		const existedToken = await this.prismaService.token.findFirst({
			where: { email, type: TokenType.PASSWORD_RESET }
		})

		if (existedToken) {
			await this.prismaService.token.delete({
				where: {
					id: existedToken.id,
					type: TokenType.PASSWORD_RESET
				}
			})
		}

		const passwordResetToken = await this.prismaService.token.create({
			data: {
				email,
				token,
				expiresIn,
				type: TokenType.PASSWORD_RESET
			}
		})

		return passwordResetToken
	}
}
