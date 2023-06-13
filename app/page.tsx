import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import RealtimePosts from "./realtime-posts";

import type { Database } from "@/lib/database.types";
type Post = Database["public"]["Tables"]["posts"]["Row"];
type PostVotes = Database["public"]["Tables"]["post_votes"]["Row"];

export default async function Home() {
	const supabase = createServerComponentClient<Database>({
		cookies,
	});

	const {
		data: { session },
	} = await supabase.auth.getSession();

	const { data: serverPosts } = await supabase.from("posts").select("*");
	const { data: serverPostVotes } = await supabase
		.from("post_votes")
		.select("*");

	const postVotesHash = serverPostVotes?.reduce(
		(acc: any, cur: PostVotes) => {
			acc[cur.post_id] = {};
			acc[cur.post_id].total
				? (acc[cur.post_id].total += cur.value)
				: (acc[cur.post_id].total = cur.value);

			if (cur.user_id === session?.user.id) {
				acc[cur.post_id].id = cur.id;
				acc[cur.post_id].value = cur.value;
			}
			return acc;
		},
		{}
	);

	return (
		<>
			<RealtimePosts
				session={session}
				serverVotesHash={postVotesHash ?? {}}
				serverPosts={serverPosts ?? []}
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
