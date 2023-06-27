"use client";

import { Session } from "@supabase/supabase-js";

export default function LoginButton({ session }: { session: Session | null }) {
	return session ? (
		<form action="/auth/signout" method="post">
			<button
				className="btn max-sm:btn-circle btn-sm btn-neutral col-span-1 "
				type="submit"
			>
				<p className="max-sm:hidden">Log-Out</p>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					strokeWidth={1.5}
					stroke="currentColor"
					className="w-6 h-6 rotate-180"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9"
					/>
				</svg>
			</button>
		</form>
	) : (
		<button
			className="btn max-sm:btn-circle btn-sm btn-neutral col-span-1"
			/* @ts-expect-error */
			onClick={() => window.login_modal.showModal()}
		>
			<p className="max-sm:hidden">Login</p>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				strokeWidth={1.5}
				stroke="currentColor"
				className="w-6 h-6 rotate-180"
			>
				<path
					strokeLinecap="round"
					strokeLinejoin="round"
					d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75"
				/>
			</svg>
		</button>
	);
}
