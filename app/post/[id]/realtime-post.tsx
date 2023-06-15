"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useEffect, useState } from "react";

import Post from "@/app/components/post";
import { ServerPost } from "@/lib/consts.types";
import type { Database } from "@/lib/database.types";

export default function RealtimePost({
	serverPost,
}: {
	serverPost: ServerPost;
}) {
	const supabase = createClientComponentClient<Database>();
	const [post, setPost] = useState(serverPost);

	useEffect(() => {
		setPost(serverPost);
	}, [serverPost]);

	useEffect(() => {
		const channel = supabase
			.channel("realtime post")
			.on(
				"postgres_changes",
				{
					event: "UPDATE",
					schema: "public",
					table: "posts",
					filter: `id=eq.${post.id}`,
				},
				(payload) => {
					setPost(payload.new as Post);
				}
			)
			.subscribe();

		return () => {
			supabase.removeChannel(channel);
		};
	}, [supabase, post, setPost]);

	return <Post post={post} />;
}
