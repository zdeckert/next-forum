"use client";
import { Database } from "@/lib/database.types";
import {
	Session,
	createClientComponentClient,
} from "@supabase/auth-helpers-nextjs";
import { useCallback, useEffect, useState } from "react";

export default function AccountForm({ session }: { session: Session | null }) {
	const supabase = createClientComponentClient<Database>();
	const [loading, setLoading] = useState(true);
	const [fullname, setFullname] = useState<string | null>(null);
	const [username, setUsername] = useState<string | null>(null);
	const [website, setWebsite] = useState<string | null>(null);
	const [avatar_url, setAvatarUrl] = useState<string | null>(null);
	const user = session?.user;

	const getProfile = useCallback(async () => {
		try {
			setLoading(true);

			let { data, error, status } = await supabase
				.from("profiles")
				.select(`full_name, username, website, avatar_url`)
				.eq("id", user?.id)
				.single();

			if (error && status !== 406) {
				throw error;
			}

			if (data) {
				setFullname(data.full_name);
				setUsername(data.username);
				setWebsite(data.website);
				setAvatarUrl(data.avatar_url);
			}
		} catch (error) {
			alert("Error loading user data!");
		} finally {
			setLoading(false);
		}
	}, [user, supabase]);

	useEffect(() => {
		getProfile();
	}, [user, getProfile]);

	async function updateProfile({
		username,
		website,
		avatar_url,
	}: {
		username: string | null;
		fullname: string | null;
		website: string | null;
		avatar_url: string | null;
	}) {
		try {
			setLoading(true);

			let { error } = await supabase.from("profiles").upsert({
				id: user?.id as string,
				full_name: fullname,
				username,
				website,
				avatar_url,
				updated_at: new Date().toISOString(),
			});
			if (error) throw error;
			alert("Profile updated!");
		} catch (error) {
			alert("Error updating the data!");
		} finally {
			setLoading(false);
		}
	}

	return (
		<div className="card card-bordered flex flex-col items-center gap-4">
			<div>
				<label className="label py-0">Email</label>
				<input
					className="input input-bordered"
					id="email"
					type="text"
					value={session?.user.email}
					disabled
				/>
			</div>
			<div>
				<label className="label py-0">Full Name</label>
				<input
					className="input input-bordered"
					id="fullName"
					type="text"
					value={fullname || ""}
					onChange={(e) => setFullname(e.target.value)}
				/>
			</div>
			<div>
				<label className="label py-0">Username</label>
				<input
					className="input input-bordered"
					id="username"
					type="text"
					value={username || ""}
					onChange={(e) => setUsername(e.target.value)}
				/>
			</div>
			<div>
				<label className="label py-0">Website</label>
				<input
					className="input input-bordered"
					id="website"
					type="url"
					value={website || ""}
					onChange={(e) => setWebsite(e.target.value)}
				/>
			</div>

			<div>
				<button
					className="btn btn-primary"
					onClick={() =>
						updateProfile({
							fullname,
							username,
							website,
							avatar_url,
						})
					}
					disabled={loading}
				>
					{loading ? "Loading ..." : "Update"}
				</button>
			</div>
		</div>
	);
}
