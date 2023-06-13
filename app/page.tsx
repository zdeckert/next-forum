import RealtimePosts from "./realtime-posts";

import type { Database } from "@/lib/database.types";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

type Post = Database["public"]["Tables"]["posts"]["Row"];

export default async function Home() {
	const supabase = createServerComponentClient({
		cookies,
	});
	const {
		data: { session },
	} = await supabase.auth.getSession();

	const { data: serverPosts } = await supabase!.from("posts").select("*");

	const postIds = serverPosts?.map(({ id }) => id);
	const { data: serverPostVotes } = await supabase!
		.from("post_votes")
		.select("*")
		.in("post_id", postIds!);

	type VoteHashT = {
		[key: string]: {
			id?: string;
			serverTotal: number;
			value?: number;
		};
	};
	const postVotesHash: VoteHashT = serverPostVotes!.reduce((acc, cur) => {
		acc[cur.post_id] = { serverTotal: 0 };
		acc[cur.post_id].serverTotal += cur.value;

		if (cur.user_id === session?.user.id) {
			acc[cur.post_id].id = cur.id;
			acc[cur.post_id].value = cur.value;
		}
		return acc;
	}, {});

	return (
		<>
			<RealtimePosts
				serverVotesHash={postVotesHash ?? {}}
				serverPosts={(serverPosts as Post[]) ?? []}
			/>

			<div className="collapse bg-base-200">
				<input type="checkbox" />
				<div className="collapse-title text-xl font-medium">
					{`Is serverPosts: ${!!serverPosts}`}
				</div>
				<div className="collapse-content">
					<pre>{JSON.stringify(serverPosts, null, 2)}</pre>
				</div>
			</div>
			<div className="collapse bg-base-200">
				<input type="checkbox" />
				<div className="collapse-title text-xl font-medium">
					{`Is voteHash: ${!!postVotesHash}`}
				</div>
				<div className="collapse-content">
					<pre>{JSON.stringify(postVotesHash, null, 2)}</pre>
				</div>
			</div>
		</>
	);
}
