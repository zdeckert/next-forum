"use client";
import { AuthProvider } from "@/components/auth";
import { redirect } from "next/navigation";
import { useAuth } from "../components/auth";
// import RedirectCheck from "./redirect-check";

export default async function LoggedInLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<AuthProvider>
			<RedirectCheck>{children}</RedirectCheck>
		</AuthProvider>
	);
}

//require a seperate componet to allow session check, otherwise session is always null.
function RedirectCheck({ children }: { children: React.ReactNode }) {
	const { session } = useAuth();

	if (!session) {
		console.log(session);
		console.log("redirected");
		redirect("/unauthorized");
	}

	return <>{children}</>;
}
