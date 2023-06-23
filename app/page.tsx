import { PostWithJoins } from "@/lib/consts.types";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import DataCollapse from "./components/testing/collapse";
import Feed from "./feed";

export default async function Home() {
	const supabase = createServerComponentClient({
		cookies,
	});

	const { data: posts } = await supabase!.from("posts").select(`*,
	channels (
		name,
		slug
	),
	profiles(
		username, avatar_url
	),
	post_votes (
		id,
		value,
		user_id
	)`);

	return (
		<>
			<Feed posts={posts as PostWithJoins[]} />
			<DataCollapse data={posts} />
		</>
	);
}
