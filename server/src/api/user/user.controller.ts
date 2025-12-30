import {
	Body,
	Controller,
	Get,
	HttpCode,
	HttpStatus,
	Param,
	Patch
} from '@nestjs/common'
import { UserRole } from '@prisma/__generated__/enums'

import { UpdateUserDto } from '@/api/user/dto'
import { Authorization, Authorized } from '@/libs/common/decorators'

import { UserService } from './user.service'

@Controller('users')
export class UserController {
	public constructor(private readonly userService: UserService) {}

	@Authorization()
	@Get('profile')
	@HttpCode(HttpStatus.OK)
	public async findProfile(@Authorized('id') id: string) {
		return this.userService.findById(id)
	}

	@Authorization(UserRole.ADMIN)
	@Get('id/:id')
	@HttpCode(HttpStatus.OK)
	public async findById(@Param('id') id: string) {
		return this.userService.findById(id)
	}

	@Authorization()
	@Patch('profile')
	@HttpCode(HttpStatus.OK)
	public async updateProfile(
		@Authorized('id') id: string,
		@Body() dto: UpdateUserDto
	) {
		return this.userService.update(id, dto)
	}
}
