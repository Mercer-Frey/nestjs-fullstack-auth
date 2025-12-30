import { Injectable, NotFoundException } from '@nestjs/common'
import { AuthMethod } from '@prisma/__generated__/enums'
import { hash } from 'argon2'

import { UpdateUserDto } from '@/api/user/dto'
import { PrismaService } from '@/prisma/prisma.service'

@Injectable()
export class UserService {
	public constructor(private prismaService: PrismaService) {}
	public async findById(id: string) {
		const user = await this.prismaService.user.findUnique({
			where: { id },
			include: {
				accounts: true
			}
		})

		if (!user) {
			throw new NotFoundException('User does not exist')
		}

		return user
	}

	public async findByEmail(email: string) {
		const user = await this.prismaService.user.findUnique({
			where: { email },
			include: {
				accounts: true
			}
		})

		return user
	}

	public async create(
		email: string,
		password: string,
		displayName: string,
		picture: string,
		authMethod: AuthMethod
	) {
		const user = await this.prismaService.user.create({
			data: {
				email,
				password: password ? await hash(password) : '',
				displayName,
				picture,
				authMethod
			},
			include: {
				accounts: true
			}
		})

		return user
	}

	public async update(userId: string, dto: UpdateUserDto) {
		const user = await this.findById(userId)

		if (!user) {
			throw new NotFoundException('User does not exist')
		}

		const updatedUser = await this.prismaService.user.update({
			where: {
				id: user.id
			},
			data: {
				email: dto.email,
				displayName: dto.name,
				isTwoFactorEnabled: dto.isTwoFactorEnabled
			}
		})

		return updatedUser
	}
}
