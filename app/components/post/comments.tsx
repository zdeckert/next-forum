import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

import { Database } from "@/lib/database.types";
import { FormEvent, Suspense, useState } from "react";
import { useAuth } from "../auth";
import DataCollapse from "../testing/collapse";

type Comment = Database["public"]["Tables"]["comments"]["Row"];

export default function Comments({ postId }: { postId: string }) {
	const [submitLoading, setSubmitLoading] = useState<boolean>(false);

	const [commentInput, setCommentInput] = useState<string>();

	const { session, profile } = useAuth();
	const supabase = createClientComponentClient();

	async function addComment(e: FormEvent) {
		e.preventDefault();
		setSubmitLoading(true);
		console.log(
			JSON.stringify({
				post_id: postId,
				user_id: session!.user.id,
				text: commentInput,
			})
		);
		await supabase.from("comments").insert({
			post_id: postId,
			user_id: session!.user.id,
			text: commentInput,
		});
		setSubmitLoading(false);
		setCommentInput("");
	}

	return (
		<div className="w-full">
			<p className="text-xl">Comments</p>
			<>
				{session ? (
					<>
						<p>Comment as {profile?.username}</p>
						<form onSubmit={(e) => addComment(e)}>
							<textarea
								className="textarea w-full h-4 textarea-bordered"
								onChange={(e) =>
									setCommentInput(
										(e.target as HTMLTextAreaElement).value
									)
								}
								value={commentInput}
							/>
							<button
								className="btn btn-primary btn-xs"
								type="submit"
								disabled={submitLoading}
							>
								Comment
							</button>
						</form>
					</>
				) : (
					<></>
				)}
			</>
			<Suspense fallback={<p>Loading Comments</p>}>
				<CommentsFeed />
			</Suspense>
		</div>
	);
}

async function CommentsFeed() {
	const supabase = createClientComponentClient();
	const { data: comments } =
		(await supabase.from("comments").select(
			`*,
			comment_votes (
				*
			),
			profiles (
				username
			)`
		)) || [];

	console.log(comments);

	return (
		<>
			{comments!.map((comment) => (
				<>
					<DataCollapse data={comment} />
					<p>{comment.text}</p>;<p>{comment.profiles.username}</p>
				</>
			))}
		</>
	);
}
