"use client";

import { useEffect, useState } from "react";

import { AuthProvider, useAuth } from "@/components/auth";
import Post from "@/components/post";
import { ServerPost } from "@/lib/consts.types";
import { Database } from "@/lib/database.types";

type Post = Database["public"]["Tables"]["posts"]["Row"];

export default function RealtimePosts({
	serverPosts,
}: {
	serverPosts: ServerPost[];
}) {
	const [posts, setPosts] = useState(serverPosts);

	const { supabase } = useAuth();

	useEffect(() => {
		setPosts(serverPosts);
	}, [serverPosts]);

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
		<AuthProvider>
			{posts.map((post) => (
				<Post key={post.id} post={post} />
			))}
		</AuthProvider>
	);
}
