import {
	ConflictException,
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
import { UserService } from '@/api/user/user.service'
import { PrismaService } from '@/prisma/prisma.service'

@Injectable()
export class AuthService {
	public constructor(
		private readonly prismaService: PrismaService,
		private readonly userService: UserService,
		private readonly configService: ConfigService
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

		return await this.saveSession(req, user)
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

		await this.saveSession(req, user)
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

	private async saveSession(req: Request, user: User) {
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
