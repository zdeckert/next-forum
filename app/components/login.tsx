"use server";

import LoginButton from "@/components/login-button";
import LoginForm from "@/components/login-form";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

import type { Database } from "@/lib/database.types";
import LoginModal from "./login-modal";

export default async function Login() {
	const supabase = createServerComponentClient<Database>({ cookies });

	const {
		data: { session },
	} = await supabase.auth.getSession();

	return (
		<div>
			<LoginButton session={session} />
			<LoginModal>
				<LoginForm />
			</LoginModal>
		</div>
	);
}
