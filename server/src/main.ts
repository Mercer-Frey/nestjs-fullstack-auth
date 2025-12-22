import { ValidationPipe } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import { RedisStore } from 'connect-redis'
import cookieParser from 'cookie-parser'
import session from 'express-session'
import ms, { StringValue } from 'ms'
import { parseBoolean } from 'parser-boolean'
import { createClient } from 'redis'

import { AppModule } from './app.module'

async function bootstrap() {
	const app = await NestFactory.create(AppModule)
	const config = app.get(ConfigService)
	const client = createClient({
		url: config.getOrThrow<string>('REDIS_URI')
	})

	await client.connect()

	app.use(cookieParser(config.getOrThrow<string>('COOKIES_SECRET')))

	app.useGlobalPipes(
		new ValidationPipe({
			transform: true
		})
	)

	app.use(
		session({
			secret: config.getOrThrow<string>('SESSION_SECRET'),
			name: config.getOrThrow<string>('SESSION_NAME'),
			resave: true,
			saveUninitialized: false,
			cookie: {
				domain: config.getOrThrow<string>('SESSION_DOMAIN'),
				maxAge: ms(config.getOrThrow<StringValue>('SESSION_MAX_AGE')),
				httpOnly: parseBoolean(
					config.getOrThrow<string>('SESSION_HTTP_ONLY'),
					true
				),
				secure: parseBoolean(
					config.getOrThrow<string>('SESSION_SECURE'),
					true
				),
				sameSite: 'lax'
			},
			store: new RedisStore({
				client,
				prefix: config.getOrThrow<string>('SESSION_FOLDER')
			})
		})
	)

	app.enableCors({
		origin: config.getOrThrow<string>('ALLOWED_ORIGIN'),
		credentials: true,
		exposeHeaders: ['set-cookie']
	})

	app.setGlobalPrefix('api')

	await app.listen(config.getOrThrow<number>('APPLICATION_PORT'))
}
void bootstrap()
