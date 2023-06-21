"use client";

import { useAuth } from "@/app/components/auth";
import Post from "@/app/components/post/post";
import { PostWithJoins } from "@/lib/consts.types";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useEffect, useState } from "react";

export default function SinglePost({
	params: { id },
}: {
	params: { id: string };
}) {
	const [post, setPost] = useState<PostWithJoins>();
	const [loading, setLoading] = useState(true);

	const supabase = createClientComponentClient();

	const { session } = useAuth();

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

			setPost(post as PostWithJoins);
			setLoading(false);
		}

		setData();
	}, [id, post, session, supabase]);

	// if (!post) {
	// 	notFound
	// }

	return loading ? <p>...</p> : <Post post={post as PostWithJoins} />;
}
