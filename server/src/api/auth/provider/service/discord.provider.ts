import { BaseOAuthService } from '@/api/auth/provider/service/base-oauth.service'
import type {
	BaseOAuthProfile,
	TypeProviderOptions,
	TypeUserInfo
} from '@/api/auth/provider/types'

// Профиль пользователя от Discord API endpoint /users/@me
interface DiscordProfile {
	id: string // Уникальный ID пользователя (snowflake)
	username: string // Логин (не уникальный)
	discriminator: string // 4 цифры (в новых аккаунтах часто "0")
	global_name?: string | null // Отображаемое имя (display name)
	avatar?: string | null // Хэш аватара
	email?: string | null // Только если запрошен scope 'email'
	verified?: boolean // Только если запрошен scope 'email'
	// Другие поля (banner, locale и т.д.) могут присутствовать
}

export class DiscordProvider extends BaseOAuthService {
	public constructor(options: TypeProviderOptions) {
		super({
			name: 'discord',
			authorize_url: 'https://discord.com/oauth2/authorize',
			access_url: 'https://discord.com/api/oauth2/token',
			profile_url: 'https://discord.com/api/users/@me',
			scopes: options.scopes ?? ['identify', 'email'], // 'identify' обязательно, 'email' для получения почты
			client_id: options.client_id,
			client_secret: options.client_secret
		})
	}

	// Переопределяем extractUserInfo с широким типом параметра (как в базовом классе)
	protected override extractUserInfo(
		profile: BaseOAuthProfile
	): Omit<
		TypeUserInfo,
		'access_token' | 'refresh_token' | 'expires_at' | 'provider'
	> {
		// Мы знаем, что для Discord это DiscordProfile → безопасный assertion
		const discordProfile = profile as unknown as DiscordProfile

		// Формируем URL аватара (если есть avatar)
		const picture = discordProfile.avatar
			? `https://cdn.discordapp.com/avatars/${discordProfile.id}/${discordProfile.avatar}.png`
			: '' // fallback на дефолтный аватар Discord можно добавить, если нужно

		// Имя: предпочитаем global_name, иначе username#discriminator
		const name =
			discordProfile.global_name ||
			`${discordProfile.username}#${discordProfile.discriminator}`

		return {
			id: discordProfile.id,
			email: discordProfile.email ?? '', // Если email не запрошен — будет пусто
			name,
			picture
		}
	}
}
