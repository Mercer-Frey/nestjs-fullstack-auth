import { IsNotEmpty, IsString } from 'class-validator'

export class EmailConfirmDto {
	@IsString({ message: 'Email must be a string' })
	@IsNotEmpty({ message: 'Email is required' })
	token: string
}
