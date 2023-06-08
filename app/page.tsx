import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import RealtimePosts from "./realtime-posts";

import type { Database } from "@/lib/database.types";

export default async function ServerComponent() {
	const supabase = createServerComponentClient<Database>({
		cookies,
	});

	const {
		data: { session },
	} = await supabase.auth.getSession();

	const { data } = await supabase.from("posts").select("*");

	return (
		<>
			<RealtimePosts session={session} serverPosts={data ?? []} />

			<div className="collapse bg-base-200">
				<input type="checkbox" />
				<div className="collapse-title text-xl font-medium">
					{`Is session: ${!!session}`}
				</div>
				<div className="collapse-content">
					<pre>{JSON.stringify(session, null, 2)}</pre>
				</div>
			</div>
		</>
	);
}
