"use client";

import { useEffect, useState } from "react";

import { ClientAuthProvider, useAuth } from "@/components/auth/client-auth";
import Post from "@/components/post";
import type { Database } from "@/lib/database.types";
type Post = Database["public"]["Tables"]["posts"]["Row"];

type PostVoteHash = {
	[key: string]: {
		serverTotal: number;
		id?: string;
		value?: number;
	};
};

export default function RealtimePosts({
	serverPosts,
	serverVotesHash,
}: {
	serverPosts: Post[];
	serverVotesHash: PostVoteHash;
}) {
	const [posts, setPosts] = useState(serverPosts);

	const { supabase } = useAuth();

	useEffect(() => {
		setPosts(serverPosts);
	}, [serverPosts, serverVotesHash]);

	useEffect(() => {
		const channel = supabase!
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
			supabase!.removeChannel(channel);
		};
	}, [supabase, setPosts, posts]);

	return (
		<ClientAuthProvider>
			{posts.map((post) => (
				<Post
					key={post.id}
					post={post}
					serverVote={serverVotesHash[post.id] || {}}
				/>
			))}
		</ClientAuthProvider>
	);
}
