"use client";

import DataCollapse from "@/app/components/testing/collapse";
import { useAuth } from "@/components/auth";
import { ServerPost } from "@/lib/consts.types";
import { useEffect, useState } from "react";

export default function Channel({
	params: { slug },
}: {
	params: { slug: string };
}) {
	const [posts, setPosts]: [null | ServerPost[], Function] = useState(null);

	const { supabase } = useAuth();

	useEffect(() => {
		async function setData() {
			const { data } = await supabase!
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
			setPosts(data);
		}

		setData();
	}, [supabase, slug]);

	// const posts = data?.map((post) => ({
	// 	...post,
	// 	post_votes: post.post_votes.reduce(
	// 		(
	// 			acc: ServerPost["post_votes"],
	// 			cur: { id: string; user_id: string; value: number }
	// 		) => {
	// 			acc.total ? (acc.total += cur.value) : (acc.total = cur.value);
	// 			if (cur.user_id === session?.user.id) {
	// 				acc.userVote = cur.value;
	// 				acc.voteId = cur.id;
	// 			}
	// 			return { ...acc };
	// 		},
	// 		{}
	// 	),
	// }));
	return (
		<>
			<DataCollapse data={posts} />
			<DataCollapse data={slug} />
		</>
	);
}
