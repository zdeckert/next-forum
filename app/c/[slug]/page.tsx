"use client";

import CompactPost from "@/app/components/post/compact-post";
import LoadingPost from "@/app/components/post/loading-post";
import { PostWithJoins } from "@/lib/consts.types";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import Link from "next/link";
import { Suspense } from "react";

export default function Channel({
	params: { slug },
}: {
	params: { slug: string };
}) {
	return (
		<Suspense fallback={<LoadingPost />}>
			<GetChannelPosts slug={slug} />
		</Suspense>
	);
}

async function GetChannelPosts({ slug }: { slug: string }) {
	const supabase = createClientComponentClient();
	/* @ts-expect-error */
	const { data: posts }: { data: PostWithJoins[] | null } = await supabase
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
		.eq("channels.slug", slug);
	return posts === null ? (
		<div>
			<h2 className="h2 text-lg bolds">Channel not found</h2>
			<p>
				There was an error retrieving this channel. The channel may have
				been deleted or the url is incorrect.
			</p>
			<Link className="link" href="/">
				Home
			</Link>
		</div>
	) : (
		<>
			{posts!.map((post) => (
				<CompactPost key={post.id} post={post} />
			))}
		</>
	);
}
