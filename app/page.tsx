import { ServerPost } from "@/lib/consts.types";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import RealtimePosts from "./realtime-posts";

export default async function Home() {
	const supabase = createServerComponentClient({
		cookies,
	});
	const {
		data: { session },
	} = await supabase.auth.getSession();

	const { data } = await supabase!.from("posts").select(`*,
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
	)`);

	const serverPosts = data?.map((post) => ({
		...post,
		post_votes: post.post_votes.reduce(
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
	}));

	return (
		<>
			<RealtimePosts serverPosts={(serverPosts as ServerPost[]) ?? []} />
			<div className="collapse bg-base-200">
				<input type="checkbox" />
				<div className="collapse-title text-xl font-medium">
					{`Is { data }: ${!!data}`}
				</div>
				<div className="collapse-content">
					<pre>{JSON.stringify(data, null, 2)}</pre>
				</div>
			</div>
			<div className="collapse bg-base-200">
				<input type="checkbox" />
				<div className="collapse-title text-xl font-medium">
					{`Is { serverPosts }: ${!!serverPosts}`}
				</div>
				<div className="collapse-content">
					<pre>{JSON.stringify(serverPosts, null, 2)}</pre>
				</div>
			</div>
		</>
	);
}
