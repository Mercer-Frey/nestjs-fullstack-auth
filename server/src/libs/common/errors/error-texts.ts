import { ErrorCode } from './error-code.enum'
import { ErrorParams } from './error.params'

type ErrorTextResolver = (params?: ErrorParams) => string

export const ERROR_TEXTS: Record<ErrorCode, ErrorTextResolver> = {
	[ErrorCode.UNAUTHORIZED]: () => 'Authentication required',

	[ErrorCode.FORBIDDEN]: () => 'Forbidden',

	[ErrorCode.ACCESS_DENIED]: params =>
		`Access denied${params?.action ? ` for ${params.action}` : ''}`,

	[ErrorCode.NOT_FOUND]: params =>
		`${params?.entity ?? 'Resource'} not found`,

	[ErrorCode.VALIDATION_FAILED]: params =>
		`Invalid value for field "${params?.field}"`
}
