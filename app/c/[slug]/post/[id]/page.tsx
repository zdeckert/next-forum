"use client";

import { useAuth } from "@/app/components/auth";
import Post from "@/app/components/post";
import { PostWithJoin } from "@/lib/consts.types";
import { useEffect, useState } from "react";

export default function SinglePost({
	params: { id },
}: {
	params: { id: string };
}) {
	const [post, setPost]: [PostWithJoin | undefined, Function] = useState();
	const [loading, setLoading] = useState(true);

	const { session, supabase } = useAuth();

	useEffect(() => {
		async function setData() {
			const { data: post } = await supabase
				.from("posts")
				.select(
					`*,
					channels (
						name,
						slug
					),
					profiles(
						username
					),
					post_votes (
						id,
						value,
						user_id
					)`
				)
				.match({ id })
				.single();

			setPost(post);
			setLoading(false);
		}

		setData();
	}, [id, post, session, supabase]);

	// if (!post) {
	// 	notFound
	// }

	return loading ? <p>...</p> : <Post post={post} />;
}
