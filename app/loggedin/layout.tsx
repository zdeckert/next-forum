"use client";

import { AuthProvider, useAuth } from "@/components/auth";
import { redirect } from "next/navigation";

export default async function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const { session } = useAuth();

	if (!session) {
		redirect("/unauthorized");
	}

	return <AuthProvider>{children}</AuthProvider>;
}
