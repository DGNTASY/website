import MenudApp from '@/components/MenudApp';

export default function AppLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return <MenudApp>{children}</MenudApp>;
}
