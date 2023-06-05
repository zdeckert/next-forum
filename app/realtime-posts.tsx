"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useEffect, useState } from "react";

import type { Database } from "@/lib/database.types";
import Link from "next/link";
type Post = Database["public"]["Tables"]["posts"]["Row"];

export default function RealtimePosts({
	serverPosts,
}: {
	serverPosts: Post[];
}) {
	const [posts, setPosts] = useState(serverPosts);
	const supabase = createClientComponentClient<Database>();

	useEffect(() => {
		setPosts(serverPosts);
	}, [serverPosts]);

	useEffect(() => {
		const channel = supabase
			.channel("*")
			.on(
				"postgres_changes",
				{ event: "INSERT", schema: "public", table: "posts" },
				(payload) =>
					setPosts((posts) => [...posts, payload.new as Post])
			)
			.subscribe();

		return () => {
			supabase.removeChannel(channel);
		};
	}, [supabase, setPosts, posts]);

	return (
		<>
			{posts.map(({ id, title, content, upvotes, downvotes }) => (
				<div
					key={id}
					className="card card-bordered flex flex-row border-secondary-focus gap-2 p-2 mb-4 hover:bg-secondary-content"
				>
					<div className="flex flex-col items-center">
						<button className="btn btn-xs btn-square btn-ghost btn-success hover:btn-success">
							⬆
						</button>
						{upvotes - downvotes}
						<button className="btn btn-xs btn-square btn-ghost hover:btn-error">
							⬇
						</button>
					</div>
					<div className="flex flex-col ">
						<Link
							className="link-secondary text-xl"
							href={`/post/${id}`}
						>
							{title}
						</Link>

						<p className="backdrop-blur w-full text-sm overflow-hidden text-ellipsis h-[5rem] backdrop-blur-gradient">
							{content}
						</p>
					</div>
				</div>
			))}
		</>
	);
}
