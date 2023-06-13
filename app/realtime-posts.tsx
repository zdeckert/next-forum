"use client";

import {
	Session,
	createClientComponentClient,
} from "@supabase/auth-helpers-nextjs";
import { useEffect, useMemo, useState } from "react";

import AuthContext from "@/components/auth/auth-context";
import Post from "@/components/post";
import type { Database } from "@/lib/database.types";
type Post = Database["public"]["Tables"]["posts"]["Row"];
type PostVoteHash = {
	[key: string]: {
		serverTotal: number;
		id: string | undefined;
		value: number | undefined;
	};
};

export default function RealtimePosts({
	serverPosts,
	serverSession,
	serverVotesHash,
}: {
	serverPosts: Post[];
	serverSession: Session | null;
	serverVotesHash: PostVoteHash;
}) {
	const [posts, setPosts] = useState(serverPosts);
	const supabase = createClientComponentClient<Database>();

	const [sessionContext, setSessionContext] = useState(serverSession || null);

	useMemo(
		() => ({ sessionContext, setSessionContext }),
		[sessionContext, setSessionContext]
	);

	useEffect(() => {
		setPosts(serverPosts);
	}, [serverPosts, serverVotesHash]);

	useEffect(() => {
		const channel = supabase
			.channel("*")
			.on(
				"postgres_changes",
				{ event: "INSERT", schema: "public", table: "posts" },
				(payload) =>
					setPosts((posts) => [...posts, payload.new as Post])
			)
			.on(
				"postgres_changes",
				{ event: "UPDATE", schema: "public", table: "posts" },
				(payload) => {
					const updatedPost = payload.new as Post;
					setPosts((posts) => {
						const i = posts.findIndex(
							({ id }) => id === updatedPost.id
						);
						posts[i] = updatedPost;
						return [...posts];
					});
				}
			)
			.subscribe();

		return () => {
			supabase.removeChannel(channel);
		};
	}, [supabase, setPosts, posts]);

	return (
		<AuthContext>
			{posts.map((post) => (
				<Post
					key={post.id}
					post={post}
					serverVote={serverVotesHash[post.id] || {}}
				/>
			))}
		</AuthContext>
	);
}
