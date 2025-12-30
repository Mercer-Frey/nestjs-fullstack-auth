import {
	IsBoolean,
	IsEmail,
	IsNotEmpty,
	IsString,
	MinLength
} from 'class-validator'

export class UpdateUserDto {
	@IsEmail({}, { message: 'Email is not correct' })
	@IsString({ message: 'Email must be a string' })
	@IsNotEmpty({ message: 'Email is required' })
	email: string

	@IsString({ message: 'Name must be a string' })
	@MinLength(2, { message: 'Name must be at least 2 characters long' })
	name: string

	@IsBoolean({ message: 'isTwoFactorEnabled must be a boolean value' })
	isTwoFactorEnabled?: boolean
}
