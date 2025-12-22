import { AuthMethod } from '@prisma/__generated__/enums'

export function getAuthMethodFromProvider(provider: string): AuthMethod {
	const map: Partial<Record<string, AuthMethod>> = {
		google: AuthMethod.GOOGLE,
		discord: AuthMethod.DISCORD,
		steam: AuthMethod.STEAM
	}

	return map[provider.toLowerCase()] ?? AuthMethod.CREDENTIALS
}
