"use client";
import { Database } from "@/lib/database.types";
import {
	Session,
	createClientComponentClient,
} from "@supabase/auth-helpers-nextjs";
import { useCallback, useEffect, useState } from "react";
import AvatarUpload from "./avatar-upload";

export default function AccountForm({ session }: { session: Session }) {
	const supabase = createClientComponentClient<Database>();
	const [loading, setLoading] = useState(true);
	const [username, setUsername] = useState<string>("");
	const [website, setWebsite] = useState<string | null>(null);
	const [avatar_url, setAvatarUrl] = useState<string | null>(null);
	const { user } = session!;

	const getProfile = useCallback(async () => {
		try {
			setLoading(true);

			let { data, error, status } = await supabase
				.from("profiles")
				.select(`username, website, avatar_url`)
				.eq("id", user?.id)
				.single();

			if (error && status !== 406) {
				throw error;
			}

			if (data) {
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
		username: string;
		website: string | null;
		avatar_url: string | null;
	}) {
		try {
			setLoading(true);

			let { error } = await supabase.from("profiles").upsert({
				id: user?.id as string,
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
		<div className="w-full flex justify-center">
			<div className="card card-bordered border-2 border-accent bg-accent-content text-accent flex flex-col items-center gap-4 p-8 w-2/3">
				<h2 className="text-xl font-semibold">Update Profile</h2>
				<AvatarUpload
					uid={user.id}
					url={avatar_url}
					size={150}
					onUpload={(url) => {
						setAvatarUrl(url);
						updateProfile({
							username,
							website,
							avatar_url: url,
						});
					}}
				/>
				<div>
					<label className="label py-0">Email</label>
					<input
						className="input input-bordered text-base-content"
						id="email"
						type="text"
						value={session.user.email}
						disabled
					/>
				</div>
				<div>
					<label className="label py-0">Username</label>
					<input
						className="input input-bordered text-base-content"
						id="username"
						type="text"
						value={username || ""}
						onChange={(e) => setUsername(e.target.value)}
					/>
				</div>
				<div>
					<label className="label py-0">Website (Optional)</label>
					<input
						className="input input-bordered text-base-content"
						id="website"
						type="url"
						value={website || ""}
						onChange={(e) => setWebsite(e.target.value)}
					/>
				</div>

				<div>
					<button
						className="btn btn-secondary"
						onClick={() =>
							updateProfile({
								username,
								website,
								avatar_url,
							})
						}
						disabled={loading || !username}
					>
						{loading ? "Loading ..." : "Update"}
					</button>
				</div>
			</div>
		</div>
	);
}
