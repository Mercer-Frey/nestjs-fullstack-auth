import { ConfigService } from '@nestjs/config'

import { DiscordProvider } from '@/api/auth/provider/service/discord.provider'
import { GoogleProvider } from '@/api/auth/provider/service/google.provider'
import { SteamProvider } from '@/api/auth/provider/service/steam.provider'
import { TypeOptions } from '@/api/auth/provider/types'

export const getProvidersConfig = (
	configService: ConfigService
): TypeOptions => ({
	baseUrl: configService.getOrThrow<string>('APPLICATION_URL'),
	services: [
		new GoogleProvider({
			client_id: configService.getOrThrow<string>('GOOGLE_CLIENT_ID'),
			client_secret: configService.getOrThrow<string>(
				'GOOGLE_CLIENT_SECRET'
			),
			scopes: ['email', 'profile', 'openid']
		}),
		new DiscordProvider({
			client_id: configService.getOrThrow<string>('DISCORD_CLIENT_ID'),
			client_secret: configService.getOrThrow<string>(
				'DISCORD_CLIENT_SECRET'
			),
			scopes: ['identify', 'email']
		}),
		new SteamProvider(configService.getOrThrow<string>('STEAM_API_KEY'))
	]
})
