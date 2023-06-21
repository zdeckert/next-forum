"use client";

import Post from "@/app/components/post/post";
import { PostWithJoins } from "@/lib/consts.types";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Suspense } from "react";

export default function SinglePost({
	params: { id },
}: {
	params: { id: string };
}) {
	// if (!post) {
	// 	notFound
	// }

	return (
		<Suspense
			fallback={<span className="loading loading-dots loading-lg"></span>}
		>
			<GetPost id={id} />
		</Suspense>
	);
}
async function GetPost({ id }: { id: string }) {
	const supabase = createClientComponentClient();
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
	return <Post post={post as PostWithJoins} />;
}
