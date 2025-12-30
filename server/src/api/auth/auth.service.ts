import {
	ConflictException,
	forwardRef,
	Inject,
	Injectable,
	InternalServerErrorException,
	NotFoundException,
	UnauthorizedException
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { User } from '@prisma/__generated__/client'
import { AuthMethod } from '@prisma/__generated__/enums'
import { verify } from 'argon2'
import type { Request, Response } from 'express'

import { LoginDto, RegisterDto } from '@/api/auth/dto'
import { EmailConfirmService } from '@/api/auth/email-confirm/email-confirm.service'
import { ProviderService } from '@/api/auth/provider/provider.service'
import { UserService } from '@/api/user/user.service'
import { PrismaService } from '@/prisma/prisma.service'

@Injectable()
export class AuthService {
	public constructor(
		@Inject(forwardRef(() => EmailConfirmService))
		private readonly emailConfirmService: EmailConfirmService,
		private readonly prismaService: PrismaService,
		private readonly userService: UserService,
		private readonly configService: ConfigService,
		private readonly providerService: ProviderService
	) {}

	public async register(req: Request, dto: RegisterDto) {
		const { email, password, name } = dto
		const isExisted = await this.userService.findByEmail(email)

		if (isExisted) {
			throw new ConflictException('User already exists')
		}
		const user = await this.userService.create(
			email,
			password,
			name,
			'',
			AuthMethod.CREDENTIALS
		)

		await this.emailConfirmService.sendVerificationToken(user)

		return {
			message:
				'You have successfully registered, please confirm your email'
		}
	}

	public async login(req: Request, dto: LoginDto) {
		const { email, password } = dto
		const user = await this.userService.findByEmail(email)

		if (!user || !user.password) {
			throw new NotFoundException('User not found')
		}

		const isValidPassword = await verify(user.password, password)

		if (!isValidPassword) {
			throw new UnauthorizedException('Wrong credentials')
		}

		if (!user.isVerified) {
			await this.emailConfirmService.sendVerificationToken(user)

			throw new UnauthorizedException(
				'Email verification failed, please check your mailbox'
			)
		}

		await this.saveSession(req, user)
	}

	public async extractProfileFromCode(
		req: Request,
		provider: string,
		code: string
	) {
		const providerInstance = this.providerService.findByService(provider)
		const profile = await providerInstance.findUserByCode(code)
		const account = await this.prismaService.account.findUnique({
			where: {
				id: profile.id,
				provider: profile.provider
			}
		})

		let user = account?.userId
			? await this.userService.findById(account.userId)
			: null

		if (user) {
			return this.saveSession(req, user)
		}

		user = await this.prismaService.user.create({
			data: {
				email: profile.email,
				password: '',
				displayName: profile.name,
				picture: profile.picture,
				authMethod:
					AuthMethod[
						profile.provider.toUpperCase() as keyof typeof AuthMethod
					],
				isVerified: true
			},
			include: {
				accounts: true
			}
		})
		if (!account) {
			await this.prismaService.account.create({
				data: {
					userId: user.id,
					type: 'oauth',
					provider: profile.provider,
					accessToken: profile.access_token,
					refreshToken: profile.refresh_token,
					expiresAt: profile.expires_at
				}
			})
		}

		return this.saveSession(req, user)
	}

	public async logout(req: Request, res: Response): Promise<void> {
		return new Promise((resolve, reject) => {
			req.session.destroy(err => {
				if (err) {
					return reject(new InternalServerErrorException(err))
				}
				res.clearCookie(
					this.configService.getOrThrow<string>('SESSION_NAME')
				)
				resolve()
			})
		})
	}

	public async saveSession(req: Request, user: User) {
		return await new Promise((resolve, reject) => {
			req.session.userId = user.id
			req.session.save(err => {
				if (err) {
					return reject(new InternalServerErrorException(err))
				}
				resolve({ user })
			})
		})
	}
}
