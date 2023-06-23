import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

import { useRouter } from "next/navigation";
import { FormEvent, Suspense, useState } from "react";
import { useAuth } from "../auth";
import DataCollapse from "../testing/collapse";
import CommentVotes from "./comment-votes";

export default function Comments({ postId }: { postId: string }) {
	return (
		<div className="w-full">
			<p className="text-xl">Comments</p>

			<NewComment postId={postId} />

			<Suspense fallback={<p>Loading Comments</p>}>
				<GetCommentsFeed />
			</Suspense>
		</div>
	);
}

function NewComment({ postId }: { postId: string }) {
	const [submitLoading, setSubmitLoading] = useState<boolean>(false);
	const [commentInput, setCommentInput] = useState<string>();

	const { session, profile } = useAuth();
	const supabase = createClientComponentClient();
	const router = useRouter();

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
		router.refresh();
	}

	return session ? (
		<>
			<p>Comment as {profile?.username}</p>
			<form onSubmit={(e) => addComment(e)}>
				<textarea
					className="textarea w-full h-4 textarea-bordered"
					onChange={(e) =>
						setCommentInput((e.target as HTMLTextAreaElement).value)
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
	) : null;
}

async function GetCommentsFeed() {
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

	return (
		<>
			<DataCollapse data={comments} />
			{comments!.map(
				({
					id,
					text,
					profiles: { username: author },
					comment_votes: commentVotes,
				}) => (
					<div key={id} className="card card-bordered flex">
						<CommentVotes
							commentId={id}
							commentVotes={commentVotes}
						/>
						<p>{text}</p>
						<p>{author}</p>
					</div>
				)
			)}
		</>
	);
}
