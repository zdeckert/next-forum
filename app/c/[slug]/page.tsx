"use client";

import DataCollapse from "@/app/components/testing/collapse";
import { useAuth } from "@/components/auth";
import { PostWithJoins } from "@/lib/consts.types";
import { useEffect, useState } from "react";

export default function Channel({
	params: { slug },
}: {
	params: { slug: string };
}) {
	const [posts, setPosts]: [null | PostWithJoins[], Function] =
		useState(null);

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

	return (
		<>
			<DataCollapse data={posts} />
			<DataCollapse data={slug} />
		</>
	);
}
