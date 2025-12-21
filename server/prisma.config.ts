import dotenv from 'dotenv'
import dotenvExpand from 'dotenv-expand'
import { defineConfig, env } from 'prisma/config'

const envConfig = dotenv.config()
dotenvExpand.expand(envConfig)

export default defineConfig({
	schema: 'prisma/schema.prisma',
	migrations: {
		path: 'prisma/migrations'
	},
	datasource: {
		url: env('POSTGRES_URI')
	}
})
