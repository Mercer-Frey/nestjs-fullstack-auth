import { Body, Button, Container, Head, Heading, Hr, Html, Preview, Section, Text } from '@react-email/components'
import { Tailwind } from '@react-email/tailwind'
import React from 'react'
import { ResetPasswordTemplateProps } from '@/libs/smtp/templates/props/reset-password-template-props.interface'

export function ResetPasswordTemplate({ token, domain }: ResetPasswordTemplateProps) {
	const resetLink = `${domain}/api/auth/password-recovery/reset/${token}`;

	return (
		<Html>
			{/* eslint-disable-next-line prettier/prettier */}
			<Preview>Reset your password — YourApp</Preview>

			<Tailwind>
				<Head />

				<Body className="bg-gray-100 font-sans">
					<Container className="mx-auto max-w-lg rounded-lg bg-white px-8 py-12 shadow-lg">
						<Heading className="mb-8 text-center text-3xl font-bold text-gray-900">
							Reset Your Password
						</Heading>

						<Text className="mb-6 text-lg leading-relaxed text-gray-700">
							Hello!
						</Text>

						<Text className="mb-10 text-lg leading-relaxed text-gray-700">
							We received a request to reset the password for your account. Click the button below to set a new password:
						</Text>

						<Section className="mb-10 text-center">
							<Button
								href={resetLink}
								className="inline-block rounded-lg bg-blue-600 px-8 py-4 text-lg font-semibold text-white no-underline transition hover:bg-blue-700"
							>
								Set New Password
							</Button>
						</Section>

						<Text className="mb-4 text-sm text-gray-600">
							If the button doesn't work, copy and paste this link into your browser:
						</Text>

						<Text className="mb-10 break-all text-sm font-medium text-blue-600 underline">
							{resetLink}
						</Text>

						<Text className="mb-8 text-base leading-relaxed text-gray-700">
							This link will expire in 1 hour for security reasons. If you didn't request a password reset, you can safely ignore this email — your password will remain unchanged.
						</Text>

						<Hr className="my-10 border-gray-300" />

						<Text className="text-center text-sm text-gray-500">
							If you didn't ask to reset your password, please disregard this email.
						</Text>

						<Text className="mt-8 text-center text-xs text-gray-400">
							© 2025 YourApp. All rights reserved.
						</Text>
					</Container>
				</Body>
			</Tailwind>
		</Html>
	);
}

export default ResetPasswordTemplate;