import { AuthProvider } from "@/components/auth";

export default async function ChannelLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return <AuthProvider>{children}</AuthProvider>;
}
