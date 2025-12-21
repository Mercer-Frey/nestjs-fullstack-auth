import {
	ValidationArguments,
	ValidatorConstraint,
	ValidatorConstraintInterface
} from 'class-validator'

import { RegisterDto } from '@/api/auth/dto'

@ValidatorConstraint()
export class IsPasswordMatchConstraint implements ValidatorConstraintInterface {
	defaultMessage(validationArguments?: ValidationArguments): string {
		return 'Passwords do not match'
	}

	validate(
		value: any,
		validationArguments?: ValidationArguments
	): Promise<boolean> | boolean {
		const obj = validationArguments.object as RegisterDto

		return obj.password === value
	}
}
