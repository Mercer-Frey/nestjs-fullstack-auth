import { Body, Button, Container, Head, Heading, Hr, Html, Preview, Section, Text } from '@react-email/components'
import { Tailwind } from '@react-email/tailwind'
import * as React from 'react'

interface TwoFactorSetupTemplateProps {
	token: string
}

export function TwoFactorSetupTemplate({ token }: TwoFactorSetupTemplateProps) {

	return (
		<Html>
			{/* eslint-disable-next-line prettier/prettier */}
			<Preview>Enable two-factor authentication on your account</Preview>

			<Tailwind>
				<Head />

				<Body className="bg-gray-100 font-sans">
					<Container className="mx-auto max-w-lg rounded-lg bg-white px-8 py-12 shadow-lg">
						<Heading className="mb-8 text-center text-3xl font-bold text-gray-900">
							Enable Two-Factor Authentication
						</Heading>

						<Text className="mb-6 text-lg leading-relaxed text-gray-700">
							Hello! your code <strong>{token}</strong>
						</Text>

						<Text className="mb-8 text-lg leading-relaxed text-gray-700">
							We recommend turning on two-factor authentication (2FA) to make your account much more secure.
						</Text>

						<Section className="mb-10 text-center">
							<Button
								className="inline-block rounded-lg bg-green-600 px-10 py-5 text-lg font-semibold text-white no-underline transition hover:bg-green-700"
							>
								Set Up 2FA Now
							</Button>
						</Section>

						<Text className="mb-8 text-base leading-relaxed text-gray-700">
							Click the button above to go to the security settings page and complete 2FA setup.
						</Text>

						<Text className="mb-8 text-base leading-relaxed text-gray-700">
							If you didn’t request this, you can safely ignore this email — nothing will change.
						</Text>

						<Hr className="my-10 border-gray-300" />

						<Text className="text-center text-sm text-gray-600">
							With 2FA your account stays protected even if someone gets your password.
						</Text>

						<Text className="mt-8 text-center text-xs text-gray-400">
							© {new Date().getFullYear()} YourApp. All rights reserved.
						</Text>
					</Container>
				</Body>
			</Tailwind>
		</Html>
	)
}

export default TwoFactorSetupTemplate