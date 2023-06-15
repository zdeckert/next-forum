import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";

import { ServerPost } from "@/lib/consts.types";
import type { Database } from "@/lib/database.types";
import RealtimePost from "./realtime-post";

export default async function Post({
	params: { id },
}: {
	params: { id: string };
}) {
	const supabase = createServerComponentClient<Database>({
		cookies,
	});

	const {
		data: { session },
	} = await supabase.auth.getSession();

	const { data: serverPost } = await supabase
		.from("posts")
		.select(
			`*,
		channels (
			name
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

	const post = {
		...serverPost,
		post_votes: serverPost!.post_votes.reduce(
			(
				acc: ServerPost["post_votes"],
				cur: { id: string; user_id: string; value: number }
			) => {
				acc.total ? (acc.total += cur.value) : (acc.total = cur.value);
				if (cur.user_id === session?.user.id) {
					acc.userVote = cur.value;
					acc.voteId = cur.id;
				}
				return { ...acc };
			},
			{}
		),
	};

	if (!post) {
		notFound();
	}

	return <RealtimePost serverPost={post} />;
}
