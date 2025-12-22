import { BadRequestException, UnauthorizedException } from '@nestjs/common'

import { BaseOAuthService } from '@/api/auth/provider/service/base-oauth.service'
import type { BaseOAuthProfile, TypeUserInfo } from '@/api/auth/provider/types'

interface SteamPlayer {
	steamid: string
	personaname: string
	avatarfull: string
	communityvisibilitystate: number
}

interface SteamProfileResponse {
	response: {
		players: SteamPlayer[]
	}
}

export class SteamProvider extends BaseOAuthService {
	// Мы НЕ передаём TypeProviderOptions, а только API ключ
	public constructor(private readonly apiKey: string) {
		super({
			name: 'steam',
			authorize_url: 'https://steamcommunity.com/openid/login',
			access_url: '',
			profile_url: '',
			scopes: [], // не используются
			client_id: '', // не используется
			client_secret: apiKey // сохраняем как client_secret (это Steam Web API Key)
		})
	}

	public override getAuthUrl(): string {
		const redirectUrl = this.getRedirectUrl()

		const params = new URLSearchParams({
			'openid.ns': 'http://specs.openid.net/auth/2.0',
			'openid.mode': 'checkid_setup',
			'openid.return_to': redirectUrl,
			'openid.realm': `${new URL(redirectUrl).origin}/`,
			'openid.identity':
				'http://specs.openid.net/auth/2.0/identifier_select',
			'openid.claimed_id':
				'http://specs.openid.net/auth/2.0/identifier_select'
		})

		return `https://steamcommunity.com/openid/login?${params.toString()}`
	}

	public override async findUserByCode(
		queryString: string
	): Promise<TypeUserInfo> {
		const params = new URLSearchParams(queryString)

		if (params.get('openid.mode') !== 'id_res') {
			throw new BadRequestException('Invalid Steam OpenID response mode')
		}

		const claimedId = params.get('openid.claimed_id')

		if (!claimedId) {
			throw new BadRequestException('Missing openid.claimed_id')
		}

		const steamIdMatch = claimedId.match(/\/id\/(\d+)$/)

		if (!steamIdMatch) {
			throw new BadRequestException(
				'Invalid SteamID format in claimed_id'
			)
		}

		const steamId = steamIdMatch[1]

		// Проверка подписи (обязательно!)
		const verifyParams = new URLSearchParams(params)
		verifyParams.set('openid.mode', 'check_authentication')

		const verifyResponse = await fetch(
			'https://steamcommunity.com/openid/login',
			{
				method: 'POST',
				body: verifyParams,
				headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
			}
		)

		const verifyText = await verifyResponse.text()

		if (!verifyText.includes('is_valid:true')) {
			throw new UnauthorizedException(
				'Steam OpenID authentication failed'
			)
		}

		// Получение профиля
		const profileUrl = `https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${this.options.client_secret}&steamids=${steamId}`

		const profileRequest = await fetch(profileUrl)

		if (!profileRequest.ok) {
			throw new UnauthorizedException('Failed to fetch Steam profile')
		}

		// Безопасный assertion (мы знаем структуру ответа Steam API)
		const data = (await profileRequest.json()) as SteamProfileResponse

		const player = data.response.players?.[0]

		if (!player) {
			throw new BadRequestException('Steam user not found')
		}

		if (player.communityvisibilitystate !== 3) {
			throw new BadRequestException('Steam profile is not public')
		}

		return {
			id: player.steamid,
			email: '', // Steam не предоставляет email через OpenID
			name: player.personaname,
			picture: player.avatarfull,
			provider: 'steam', // жёстко задаём, т.к. name нет в TypeProviderOptions
			access_token: undefined,
			refresh_token: undefined,
			expires_at: Math.floor(Date.now() / 1000) + 31536000 // 1 year
		}
	}

	// Обязательно возвращаем правильный тип, даже если метод не используется
	protected override extractUserInfo(
		_profile: BaseOAuthProfile
	): Omit<
		TypeUserInfo,
		'access_token' | 'refresh_token' | 'expires_at' | 'provider'
	> {
		throw new Error('extractUserInfo is not used for Steam provider')
	}
}
