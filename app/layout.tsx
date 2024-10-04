import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ToasterProvider } from '@/providers/toaster-provider';
import Header from '@/components/header';
import {redirect} from "next/navigation";
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
	title: 'NX Articles',
	description: 'Article generator',
	icons: {
		icon: '/favicon-1.png',
	},
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	redirect('/not-found')
	return (
		<html lang="en">
			<body className={inter.className}>
				<ToasterProvider />
				<Header />
				{children}
			</body>
		</html>
	);
}
