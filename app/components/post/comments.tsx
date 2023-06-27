import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

import { useRouter } from "next/navigation";
import { FormEvent, Suspense, useState } from "react";
import { useAuth } from "../auth";
import CommentVotes from "./comment-votes";

export default function Comments({ postId }: { postId: string }) {
	return (
		<div className="w-full flex flex-col gap-4">
			<div className="text-xl divider">Comments</div>

			<NewComment postId={postId} />

			<Suspense
				fallback={
					<div className="flex justify-center">
						<p>Loading Comments</p>
					</div>
				}
			>
				<GetCommentsFeed postId={postId} />
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
		<div className="px-4">
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
		</div>
	) : null;
}

async function GetCommentsFeed({ postId }: { postId: string }) {
	const supabase = createClientComponentClient();

	const { data: comments } =
		(await supabase
			.from("comments")
			.select(
				`*,
			comment_votes (
				*
			),
			profiles (
				username
			)`
			)
			.eq("post_id", postId)) || [];

	return (
		<div className="flex flex-col gap-4 px-4 pb-4">
			{comments!.map(
				({
					id,
					user_id: userId,
					text,
					profiles: { username: author },
					comment_votes: commentVotes,
				}) => (
					<div
						key={id}
						className="card card-bordered flex flex-row p-2 gap-2"
					>
						<CommentVotes
							commentId={id}
							commentVotes={commentVotes}
						/>
						<Comment comment={{ author, text, id, userId }} />
					</div>
				)
			)}
		</div>
	);
}

function Comment({
	comment: { author, id, text, userId },
}: {
	comment: {
		author: string;
		id: string;
		text: string;
		userId: string;
	};
}) {
	const [showEdit, setShowEdit] = useState<boolean>(false);
	const [showDelete, setShowDelete] = useState<boolean>(false);
	const [deleteLoading, setDeleteLoading] = useState<boolean>(false);
	const [commentUpdate, setCommentUpdate] = useState<string>(text);
	const [updateLoading, setUpdateLoading] = useState<boolean>(false);
	const { session } = useAuth();

	const isAuthor = userId === session?.user.id;

	const supabase = createClientComponentClient();
	const router = useRouter();

	async function updateComment(e: FormEvent) {
		e.preventDefault();
		setUpdateLoading(true);
		await supabase
			.from("comments")
			.update({
				text: commentUpdate,
			})
			.eq("id", id);
		setUpdateLoading(false);
		setShowEdit(false);
		router.refresh();
	}

	async function deleteComment(e: FormEvent) {
		e.preventDefault();
		setDeleteLoading(true);
		await supabase.from("comments").delete().eq("id", id);
		setDeleteLoading(false);
		setShowDelete(false);
		router.refresh();
	}

	return (
		<div className="flex flex-col w-full">
			<div className="flex w-full h-4 gap-2">
				<p className="text-xs">author: {author}</p>
				{isAuthor ? (
					<>
						<button
							onClick={() => setShowEdit(!showEdit)}
							className="text-xs link link-hover link-warning"
						>
							edit
						</button>
						{showDelete ? (
							<div className="text-xs flex gap-1">
								<p>confirm delete?</p>
								<form
									onSubmit={(e: FormEvent) =>
										deleteComment(e)
									}
								>
									<button
										type="submit"
										disabled={deleteLoading}
										className="link link-hover link-error"
									>
										yes
									</button>
								</form>
								<p>/</p>
								<button
									onClick={() => setShowDelete(false)}
									className="link link-hover link-warning"
								>
									no
								</button>
							</div>
						) : (
							<button
								onClick={() => setShowDelete(true)}
								className="text-xs link link-hover link-error"
							>
								delete
							</button>
						)}
					</>
				) : null}
			</div>
			{showEdit ? (
				<form className="w-full" onSubmit={(e) => updateComment(e)}>
					<textarea
						className="textarea w-full h-4 textarea-bordered"
						onChange={(e) =>
							setCommentUpdate(
								(e.target as HTMLTextAreaElement).value
							)
						}
						value={commentUpdate}
					/>
					<button
						className="btn btn-warning btn-xs"
						type="submit"
						disabled={updateLoading}
					>
						update
					</button>
				</form>
			) : (
				<p>{text}</p>
			)}
		</div>
	);
}
