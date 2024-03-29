"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

import GoogleIcon from "@/public/google-icon.svg";
import Image from "next/image";
import { redirect, useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginForm() {
	const supabase = createClientComponentClient();

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const router = useRouter();

	async function handleSignUp() {
		const { data, error } = await supabase.auth.signUp({
			email,
			password,
			options: {
				emailRedirectTo: `${location.origin}/auth/callback`,
			},
		});

		console.log(`DATA: ${JSON.stringify(data)}`, `ERROR: ${error}`);
		router.refresh();
	}

	async function handleSignIn() {
		const { data, error } = await supabase.auth.signInWithPassword({
			email,
			password,
		});
		console.log(`DATA: ${JSON.stringify(data)}`, `ERROR: ${error}`);
		router.refresh();
	}

	async function signInWithGoogle() {
		const { data, error } = await supabase.auth.signInWithOAuth({
			provider: "google",
			options: {
				redirectTo: `${location.origin}/auth/callback`,
			},
		});
		if (data.url) {
			console.log(data.url);
			redirect(`${data.url}/loggedin`);
		}
		console.log(`DATA: ${JSON.stringify(data)}`, `ERROR: ${error}`);
	}

	return (
		<>
			<form method="dialog" className="modal-box grid grid-cols-2 gap-4">
				<h2 className="text-center col-span-2 text-xl">
					Login to comment and create posts!
				</h2>
				<div className="col-span-2 h-12" />
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
				<label className="label py-0">
					<span className="label-text">Email</span>
				</label>
				<input
					className="input input-bordered col-span-2"
					name="email"
					onChange={(e) => setEmail(e.target.value)}
					value={email}
				/>
				<label className="label py-0">
					<span className="label-text">Password</span>
				</label>
				<input
					type="password"
					className="input input-bordered col-span-2"
					name="password"
					onChange={(e) => setPassword(e.target.value)}
					value={password}
				/>

				<button
					className="btn btn-sm btn-secondary col-span-1"
					onClick={handleSignIn}
					disabled={!(email && password)}
				>
					Sign in
				</button>
				<button
					className="btn btn-sm btn-primary col-span-1"
					onClick={handleSignUp}
					disabled={!(email && password)}
				>
					Sign up
				</button>
			</form>
			<form method="dialog" className="modal-backdrop">
				<button>close</button>
			</form>
		</>
	);
}
