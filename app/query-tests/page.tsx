import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export default async function QueryTest() {
	const supabase = createServerComponentClient({
		cookies,
	});

	const { data } = await supabase!.from("posts").select(`
	            *,
	            channels (
	                name
	            ),
	            profiles(
	                username
	            ),
	            post_votes (
	                value,
                    user_id
	            )`);

	return (
		<div className="collapse bg-base-200">
			<input type="checkbox" />
			<div className="collapse-title text-xl font-medium">
				{`Is { data }: ${!!data}`}
			</div>
			<div className="collapse-content">
				<pre>{JSON.stringify(data, null, 2)}</pre>
			</div>
		</div>
	);
}