import { IsEmail, IsNotEmpty, IsString } from 'class-validator'

export class ResetPasswordDto {
	@IsEmail({}, { message: 'Email is not correct' })
	@IsString({ message: 'Email must be a string' })
	@IsNotEmpty({ message: 'Email is required' })
	email: string
}
