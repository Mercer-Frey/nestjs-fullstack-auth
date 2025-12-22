import {
	BadRequestException,
	ForbiddenException,
	NotFoundException,
	UnauthorizedException
} from '@nestjs/common'

import { ErrorCode } from './error-code.enum'
import { ERROR_TEXTS } from './error-texts'
import { ErrorParams } from './error.params'

export class ExceptionFactory {
	static unauthorized(params?: ErrorParams) {
		return new UnauthorizedException({
			code: ErrorCode.UNAUTHORIZED,
			message: ERROR_TEXTS[ErrorCode.UNAUTHORIZED](params)
		})
	}

	static forbidden(code: ErrorCode, params?: ErrorParams) {
		return new ForbiddenException({
			code,
			message: ERROR_TEXTS[code](params)
		})
	}

	static notFound(params?: ErrorParams) {
		return new NotFoundException({
			code: ErrorCode.NOT_FOUND,
			message: ERROR_TEXTS[ErrorCode.NOT_FOUND](params)
		})
	}

	static validation(params?: ErrorParams) {
		return new BadRequestException({
			code: ErrorCode.VALIDATION_FAILED,
			message: ERROR_TEXTS[ErrorCode.VALIDATION_FAILED](params)
		})
	}
}
