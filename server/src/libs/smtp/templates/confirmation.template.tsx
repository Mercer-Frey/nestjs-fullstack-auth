import { Body, Button, Container, Head, Heading, Hr, Html, Preview, Section, Text } from '@react-email/components';
import { Tailwind } from '@react-email/tailwind';
import React from 'react';

interface ConfirmationTemplateProps {
	token: string;
	domain: string;
}

export function ConfirmationTemplate({ token, domain }: ConfirmationTemplateProps) {
	const confirmLink = `${domain}/api/auth/new-verification?token=${token}`;

	return (
		<Html>
			{/* eslint-disable-next-line prettier/prettier */}
			<Preview>Confirm your email address</Preview>

			<Tailwind>
				<Head />

				<Body className="bg-gray-100 font-sans">
					<Container className="mx-auto max-w-lg rounded-lg bg-white px-8 py-12 shadow-lg">
						<Heading className="mb-8 text-center text-3xl font-bold text-gray-900">
							Confirm Your Email
						</Heading>

						<Text className="mb-6 text-lg leading-relaxed text-gray-700">
							Hello!
						</Text>

						<Text className="mb-10 text-lg leading-relaxed text-gray-700">
							Thank you for signing up. To complete your registration, please confirm your email address by clicking the button below:
						</Text>

						<Section className="mb-10 text-center">
							<Button
								href={confirmLink}
								className="inline-block rounded-lg bg-blue-600 px-8 py-4 text-lg font-semibold text-white no-underline transition hover:bg-blue-700"
							>
								Confirm Email Address
							</Button>
						</Section>

						<Text className="mb-4 text-sm text-gray-600">
							If the button doesn't work, copy and paste the link below into your browser:
						</Text>

						<Text className="mb-10 break-all text-sm font-medium text-blue-600 underline">
							{confirmLink}
						</Text>

						<Hr className="my-10 border-gray-300" />

						<Text className="text-center text-sm text-gray-500">
							If you didn't create an account with us, you can safely ignore this email.
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

export default ConfirmationTemplate;