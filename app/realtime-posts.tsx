"use client";

import {
	Session,
	createClientComponentClient,
} from "@supabase/auth-helpers-nextjs";
import { useEffect, useState } from "react";

import Post from "@/components/post";
import type { Database } from "@/lib/database.types";
type Post = Database["public"]["Tables"]["posts"]["Row"];
type PostVotes = Database["public"]["Tables"]["post_votes"]["Row"];
type PostVoteHash = {
	[key: string]: {
		total: number;
		id: string | undefined;
		value: number | undefined;
	};
};

export default function RealtimePosts({
	serverPosts,
	session,
	serverVotesHash,
}: {
	serverPosts: Post[];
	session: Session | null;
	serverVotesHash: PostVoteHash;
}) {
	const [posts, setPosts] = useState(serverPosts);
	const [votesHash, setVotesHash] = useState(serverVotesHash);
	const supabase = createClientComponentClient<Database>();

	useEffect(() => {
		setPosts(serverPosts);
		setVotesHash(serverVotesHash);
	}, [serverPosts, serverVotesHash]);

	function handlePostVoteChanges(updatedPostVote: PostVotes) {
		setVotesHash((postVoteHash) => {
			if (!postVoteHash[updatedPostVote.post_id]) {
				postVoteHash[updatedPostVote.post_id] = { total: 0 };
			}

			const updatedTotal =
				updatedPostVote.value === 1
					? postVoteHash[updatedPostVote.post_id].total + 1
					: postVoteHash[updatedPostVote.post_id].total - 2;

			return {
				...postVoteHash,
				[updatedPostVote.post_id]: {
					total: updatedTotal,
					id: updatedPostVote.id,
					value: updatedPostVote.value,
				},
			};
		});
	}

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
			.on(
				"postgres_changes",
				{ event: "INSERT", schema: "public", table: "post_votes" },
				(payload) => {
					// { id, post_id, value, user_id}
					const updatedPostVote = payload.new as PostVotes;
					handlePostVoteChanges(updatedPostVote);
				}
			)
			.on(
				"postgres_changes",
				{ event: "UPDATE", schema: "public", table: "post_votes" },
				(payload) => {
					// { id, post_id, value, user_id}
					const updatedPostVote = payload.new as PostVotes;
					handlePostVoteChanges(updatedPostVote);
				}
			)
			.on(
				"postgres_changes",
				{ event: "DELETE", schema: "public", table: "post_votes" },
				(payload) => {
					// { id, post_id, value, user_id}
					const updatedPostVote = payload.new as PostVotes;
					handlePostVoteChanges(updatedPostVote);
				}
			)
			.subscribe();

		return () => {
			supabase.removeChannel(channel);
		};
	}, [supabase, setPosts, posts, votesHash, setVotesHash]);

	return (
		<>
			{posts.map((post) => (
				<Post
					key={post.id}
					post={post}
					votes={votesHash[post.id] || {}}
					session={session}
				/>
			))}
		</>
	);
}
