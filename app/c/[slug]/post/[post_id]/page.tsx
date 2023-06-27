"use client";

import Post from "@/app/components/post/post";
import { PostWithJoins } from "@/lib/consts.types";
import { Database } from "@/lib/database.types";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import Link from "next/link";
import { Suspense } from "react";

export default function SinglePost({
	params: { post_id: postId, slug },
}: {
	params: { post_id: string; slug: string };
}) {
	return (
		<Suspense
			fallback={<span className="loading loading-dots loading-lg"></span>}
		>
			<GetPost postId={postId} slug={slug} />
		</Suspense>
	);
}
async function GetPost({ postId, slug }: { postId: string; slug: string }) {
	const supabase = createClientComponentClient<Database>();

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
		.match({ id: postId, "channels.slug": slug })
		.single();

	// bug: notFound() is inconsistant. Can cause infinite reloads
	// using null check to handle errors for non-exisitng urls or errors.

	// if (post === null) {
	// 	return notFound();
	// }

	return post === null ? (
		<div>
			<h2 className="h2 text-lg bolds">Post not found</h2>
			<p>
				There was an error retrieving this post. The post may have been
				deleted or the url is incorrect.
			</p>

			<Link className="link" href="/">
				Home
			</Link>
		</div>
	) : (
		<Post post={post as PostWithJoins} />
	);
}
