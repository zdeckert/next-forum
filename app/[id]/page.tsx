import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";

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

	if (!session) {
		// this is a protected route - only users who are signed in can view this route
		redirect("/");
	}

	const { data: post } = await supabase
		.from("posts")
		.select()
		.match({ id })
		.single();

	if (!post) {
		notFound();
	}

	return <RealtimePost serverPost={post} />;
}
