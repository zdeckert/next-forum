"use client";

import type { Session } from "@supabase/auth-helpers-nextjs";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import GoogleIcon from "../public/google-icon.svg";

export default function LoginForm({ session }: { session: Session | null }) {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const router = useRouter();
	const supabase = createClientComponentClient();

	const handleSignUp = async () => {
		await supabase.auth.signUp({
			email,
			password,
			options: {
				emailRedirectTo: `${location.origin}/auth/callback`,
			},
		});
		router.refresh();
	};

	const handleSignIn = async () => {
		await supabase.auth.signInWithPassword({
			email,
			password,
		});
		router.refresh();
	};

	const handleSignOut = async () => {
		await supabase.auth.signOut();
		router.refresh();
	};

	async function signInWithGoogle() {
		const { data, error } = await supabase.auth.signInWithOAuth({
			provider: "google",
		});
	}

	// for the `session` to be available on first SSR render, it must be
	// fetched in a Server Component and passed down as a prop
	return session ? (
		<button className="btn btn-primary" onClick={handleSignOut}>
			Sign out
		</button>
	) : (
		<>
			<button
				className="btn btn-primary col-span-1"
				/* @ts-expect-error */
				onClick={() => window.login_modal.showModal()}
			>
				Sign up
			</button>
			<dialog id="login_modal" className="modal ">
				<form
					method="dialog"
					className="modal-box grid grid-cols-2 gap-4"
				>
					<div className="col-span-2 flex justify-center">
						<button
							className="btn btn-nuetral w-1/2"
							onClick={signInWithGoogle}
						>
							<Image
								className="h-4 w-4"
								src={GoogleIcon}
								alt="Google Icon"
							/>
							Google
						</button>
					</div>
					<div className="divider col-span-2">OR</div>
					<button
						/* @ts-expect-error */
						onClick={() => window.login_modal.close()}
						className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
					>
						✕
					</button>
					<input
						className="input input-bordered col-span-2"
						name="email"
						onChange={(e) => setEmail(e.target.value)}
						value={email}
					/>
					<input
						type="password"
						className="input input-bordered col-span-2"
						name="password"
						onChange={(e) => setPassword(e.target.value)}
						value={password}
					/>

					<button
						className="btn btn-secondary col-span-1"
						onClick={handleSignIn}
						disabled={!(email && password)}
					>
						Sign in
					</button>
					<button
						className="btn btn-primary col-span-1"
						onClick={handleSignUp}
						disabled={!(email && password)}
					>
						Sign up
					</button>
				</form>
				<form method="dialog" className="modal-backdrop">
					<button>close</button>
				</form>
			</dialog>
		</>
	);
}
