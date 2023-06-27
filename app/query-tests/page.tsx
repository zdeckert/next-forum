import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export default async function QueryTest() {
	const supabase = createServerComponentClient({
		cookies,
	});

	const slug = "test_channel";
	const postId = "4f6e61b4-a26a-4447-9a66-735dfb96cc1";
	const response = await supabase
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
		.eq("id", postId)
		// .eq("channels.slug", slug)
		// .match({ id: postId })
		// .match({ id: postId, "channels.slug": slug })
		.maybeSingle();

	return (
		<div className="collapse bg-base-200">
			<input type="checkbox" />
			<div className="collapse-title text-xl font-medium">
				{`Is { data }: ${!!response}`}
			</div>
			<div className="collapse-content">
				<pre>{JSON.stringify(response, null, 2)}</pre>
			</div>
		</div>
	);
}
