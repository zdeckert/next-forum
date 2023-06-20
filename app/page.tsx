import { PostWithJoins } from "@/lib/consts.types";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import DataCollapse from "./components/testing/collapse";
import Posts from "./posts";

export default async function Home() {
	const supabase = createServerComponentClient({
		cookies,
	});
	const {
		data: { session },
	} = await supabase.auth.getSession();

	const { data: posts } = await supabase!.from("posts").select(`*,
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
	)`);

	return (
		<>
			<Posts posts={posts as PostWithJoins[]} />
			<DataCollapse data={posts} />
		</>
	);
}
