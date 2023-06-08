"use client";

import {
	Session,
	createClientComponentClient,
} from "@supabase/auth-helpers-nextjs";
import { useEffect, useState } from "react";

import Post from "@/components/post";
import type { Database } from "@/lib/database.types";
type Post = Database["public"]["Tables"]["posts"]["Row"];

export default function RealtimePosts({
	serverPosts,
	session,
}: {
	serverPosts: Post[];
	session: Session | null;
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

	const isLoggedIn: boolean = !!session;

	async function handleUpvote(id: string, upvotes: number) {
		await supabase
			.from("posts")
			.update({ upvotes: upvotes + 1 })
			.eq("id", id);
	}

	async function handleDownvote(id: string, downvotes: number) {
		await supabase
			.from("posts")
			.update({ downvotes: downvotes + 1 })
			.match({ id });
	}

	return (
		<>
			{posts.map((post) => (
				<Post
					key={post.id}
					post={post}
					isLoggedIn={isLoggedIn}
					handleUpvote={handleUpvote}
					handleDownvote={handleDownvote}
				/>
			))}
		</>
	);
}
