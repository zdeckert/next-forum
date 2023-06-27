"use client";

import { useAuth } from "@/components/auth";
import AccountForm from "./account-form";

export default async function Account() {
	const { session } = useAuth();
	return (
		<div className="w-full h-full flex justify-center items-center">
			<AccountForm session={session!} />
		</div>
	);
}
