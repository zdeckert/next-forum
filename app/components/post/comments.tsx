import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { revalidatePath } from "next/cache";

import { useState } from "react";
import { useAuth } from "../auth";

export default function Comments({ postId }: { postId: string }) {
	const [comment, setComment] = useState<string>();

	const { session } = useAuth();
	const supabase = createClientComponentClient();

	async function addComment() {
		await supabase
			.from("comments")
			.insert({
				post_id: postId,
				user_id: session!.user.id,
				text: comment,
			})
			.select();
		revalidatePath("/");
	}

	return (
		<div className="w-full h-16">
			Comments
			<textarea
				name="content"
				className="textarea w-full h-4"
				onChange={(e) =>
					setComment((e.target as HTMLTextAreaElement).value)
				}
				onSubmit={addComment}
			/>
		</div>
	);
}
