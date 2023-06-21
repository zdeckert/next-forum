"use client";

import CompactPost from "@/app/components/post/compact-post";
import LoadingPost from "@/app/components/post/loading-post";
import { PostWithJoins } from "@/lib/consts.types";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
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
	return (
		<>
			{posts!.map((post) => (
				<CompactPost key={post.id} post={post} />
			))}
		</>
	);
}
