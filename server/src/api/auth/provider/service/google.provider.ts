import { BaseOAuthService } from '@/api/auth/provider/service/base-oauth.service'
import {
	BaseOAuthProfile,
	TypeProviderOptions,
	TypeUserInfo
} from '@/api/auth/provider/types'

export class GoogleProvider extends BaseOAuthService {
	public constructor(options: TypeProviderOptions) {
		super({
			name: 'google',
			authorize_url: 'https://accounts.google.com/o/oauth2/v2/auth',
			access_url: 'https://oauth2.googleapis.com/token',
			profile_url: 'https://www.googleapis.com/oauth2/v3/userinfo',
			scopes: options.scopes,
			client_id: options.client_id,
			client_secret: options.client_secret
		})
	}

	// Правильно: параметр — BaseOAuthProfile (как в базовом классе)
	// Внутри используем type assertion, потому что знаем, что для Google это GoogleProfile
	protected override extractUserInfo(
		profile: BaseOAuthProfile // ← оставляем широкий тип
	): Omit<
		TypeUserInfo,
		'access_token' | 'refresh_token' | 'expires_at' | 'provider'
	> {
		if (!('sub' in profile) || !('email' in profile)) {
			throw new Error('Invalid Google profile structure')
		}

		// Безопасно: мы уверены в структуре ответа от Google
		const googleProfile = profile as unknown as GoogleProfile

		return {
			id: googleProfile.sub, // Google использует sub как ID
			email: googleProfile.email,
			name: googleProfile.name,
			picture: googleProfile.picture ?? ''
		}
	}
}

// interface GoogleProfile extends Record<string, any> {
// 	aud: string
// 	azp: string
// 	email: string
// 	email_verified: boolean
// 	exp: number
// 	family_name?: string
// 	given_name: string
// 	hd?: string
// 	iat: number
// 	iss: string
// 	jti?: string
// 	locale?: string
// 	name: string
// 	nbf?: number
// 	picture: string
// 	sub: string
// 	access_token: string
// 	refresh_token?: string
// }

interface GoogleProfile {
	sub: string // Это ID пользователя в Google
	name: string
	given_name?: string
	family_name?: string
	picture?: string
	email: string
	email_verified?: boolean
	locale?: string
	hd?: string // Hosted domain (для GSuite)
}
