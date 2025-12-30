import {
	BadRequestException,
	Injectable,
	UnauthorizedException
} from '@nestjs/common'

import type {
	BaseOAuthProfile,
	OAuthTokenResponse,
	TypeBaseProviderOptions,
	TypeUserInfo
} from '@/api/auth/provider/types'

@Injectable()
export class BaseOAuthService {
	private BASE_URL: string

	public constructor(protected readonly options: TypeBaseProviderOptions) {}

	set baseUrl(value: string) {
		this.BASE_URL = value
	}

	get name() {
		return this.options.name
	}

	get access_url() {
		return this.options.access_url
	}

	get profile_url() {
		return this.options.profile_url
	}

	get scopes() {
		return this.options.scopes
	}

	public getRedirectUrl() {
		return `${this.BASE_URL}/api/auth/oauth/callback/${this.options.name}`
	}

	public getAuthUrl() {
		const query = new URLSearchParams({
			response_type: 'code',
			client_id: this.options.client_id,
			redirect_uri: this.getRedirectUrl(),
			scope: (this.options.scopes ?? []).join(' '),
			access_type: 'offline',
			prompt: 'select_account'
		})

		return `${this.options.authorize_url}?${query}`
	}

	public async findUserByCode(code: string): Promise<TypeUserInfo> {
		const tokenQuery = new URLSearchParams({
			code,
			client_id: this.options.client_id,
			client_secret: this.options.client_secret,
			redirect_uri: this.getRedirectUrl(),
			grant_type: 'authorization_code'
		})

		const tokensRequest = await fetch(this.options.access_url, {
			method: 'POST',
			body: tokenQuery,
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
				Accept: 'application/json'
			}
		})

		if (!tokensRequest.ok) {
			const text = await tokensRequest.text()
			throw new BadRequestException(
				`Token ${this.options.name} not found`
			)
		}

		const tokens = (await tokensRequest.json()) as OAuthTokenResponse

		if (!tokens.access_token) {
			throw new BadRequestException('Unauthorized access token')
		}

		const userRequest = await fetch(this.options.profile_url, {
			method: 'GET',
			headers: {
				Authorization: `Bearer ${tokens.access_token}`
			}
		})

		if (!userRequest.ok) {
			throw new UnauthorizedException('Unauthorized access token')
		}

		const profile = (await userRequest.json()) as BaseOAuthProfile

		const userData = this.extractUserInfo(profile)

		const expiresAt =
			tokens.expires_at ??
			(tokens.expires_in
				? Date.now() / 1000 + tokens.expires_in
				: undefined)

		return {
			...userData,
			access_token: tokens.access_token,
			refresh_token: tokens.refresh_token,
			expires_at: expiresAt,
			provider: this.options.name
		}
	}

	// Дочерние классы (GoogleProvider и т.д.) переопределяют этот метод с правильным типом профиля
	protected extractUserInfo(
		profile: BaseOAuthProfile
	): Omit<
		TypeUserInfo,
		'access_token' | 'refresh_token' | 'expires_at' | 'provider'
	> {
		// Базовая реализация — можно использовать напрямую или маппить поля
		return {
			id: profile.id,
			email: profile.email,
			name: profile.name,
			picture: profile.picture ?? ''
		}
	}
}
