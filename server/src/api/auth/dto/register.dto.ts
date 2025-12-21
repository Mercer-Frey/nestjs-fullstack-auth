import {
	IsEmail,
	IsNotEmpty,
	IsString,
	MinLength,
	Validate
} from 'class-validator'

import { IsPasswordMatchConstraint } from '@/libs/common/decorators'

export class RegisterDto {
	@IsString({ message: 'Name must be a string' })
	@IsNotEmpty({ message: 'Name is required' })
	name: string

	@IsString({ message: 'Email must be a string' })
	@IsNotEmpty({ message: 'Email is required' })
	@IsEmail({}, { message: 'Email must be a valid email address' })
	email: string

	@IsString({ message: 'Password must be a string' })
	@IsNotEmpty({ message: 'Password is required' })
	@MinLength(6, { message: 'Password must be at least 6 characters long' })
	password: string

	@IsString({ message: 'Password confirmation must be a string' })
	@IsNotEmpty({ message: 'Password confirmation is required' })
	@MinLength(6, {
		message: 'Password confirmation must be at least 6 characters long'
	})
	@Validate(IsPasswordMatchConstraint, {
		message: 'Passwords do not match'
	})
	passwordConfirmation: string
}
