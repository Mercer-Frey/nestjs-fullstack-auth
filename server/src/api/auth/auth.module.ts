import { Module } from '@nestjs/common'

import { UserService } from '@/api/user/user.service'

import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'

@Module({
	controllers: [AuthController],
	providers: [AuthService, UserService]
})
export class AuthModule {}
