"use client";

import { Session } from "@supabase/supabase-js";

export default function LoginButton({ session }: { session: Session | null }) {
	return session ? (
		<form action="/auth/signout" method="post">
			<button
				className="btn rounded-full btn-sm btn-secondary col-span-1 "
				type="submit"
			>
				Sign out
			</button>
		</form>
	) : (
		<button
			className="btn rounded-full btn-sm btn-secondary col-span-1"
			/* @ts-expect-error */
			onClick={() => window.login_modal.showModal()}
		>
			Login
		</button>
	);
}
