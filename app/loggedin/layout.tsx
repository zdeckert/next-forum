"use client";

import { redirect } from "next/navigation";
import { ClientAuthProvider, useAuth } from "../components/auth/client-auth";

export default async function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const { session, supabase } = useAuth();

	if (!session) {
		redirect("/unauthorized");
	}

	return (
		<ClientAuthProvider supabase={supabase}>{children}</ClientAuthProvider>
	);
}
