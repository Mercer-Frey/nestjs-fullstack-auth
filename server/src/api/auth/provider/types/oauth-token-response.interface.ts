// Стандартный ответ от OAuth2 token endpoint (как у Google и большинства провайдеров)

export interface OAuthTokenResponse {
	access_token: string
	refresh_token?: string
	expires_in?: number // секунды до истечения
	expires_at?: number // редко, но бывает
	token_type?: string
	scope?: string
	error?: string
	error_description?: string
	[key: string]: unknown // на случай дополнительных полей
}
