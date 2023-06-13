"use client";

import AuthContext from "@/components/auth/auth-context";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { redirect } from "next/navigation";

export default async function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const supabase = createClientComponentClient();

	const {
		data: { session },
	} = await supabase.auth.getSession();

	if (!session) {
		redirect("/unauthorized");
	}

	return <AuthContext>{children}</AuthContext>;
}
