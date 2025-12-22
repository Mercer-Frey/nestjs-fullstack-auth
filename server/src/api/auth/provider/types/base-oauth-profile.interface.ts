// Базовый профиль пользователя (расширяется в конкретных провайдерах, например GoogleProfile)
export interface BaseOAuthProfile {
	id: string
	email: string
	name: string
	picture?: string
	[key: string]: unknown
}
