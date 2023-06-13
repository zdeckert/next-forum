import type { Database } from "@/lib/database.types";
import {
	Session,
	createClientComponentClient,
} from "@supabase/auth-helpers-nextjs";
import Link from "next/link";
type Post = Database["public"]["Tables"]["posts"]["Row"];

export default function Post({
	post: { content, id: post_id, title },
	session,
	votes: { id: vote_id, total, value },
}: {
	post: Post;
	session: Session | null;
	votes: {
		id: string | undefined;
		total: number;
		value: number | undefined;
	};
}) {
	const supabase = createClientComponentClient();

	async function HandleVote(inputValue: number) {
		console.log("handleVote", inputValue);
		// if no session, show pop up
		if (!session) {
			/* @ts-expect-error */
			window.login_modal.showModal();
			console.log("no session");
			return;
		}
		// if session with vote, pressing same button, remove vote
		if (value === inputValue) {
			await supabase.from("post_votes").delete().eq("id", vote_id);
			console.log("equal value, delete");
			return;
		}
		// if session with vote, update existing vote
		if (value && value !== inputValue) {
			await supabase
				.from("post_votes")
				.update({ value: inputValue })
				.eq("id", vote_id);
			console.log("different value, update");
			return;
		}
		// if session with no vote, insert new vote
		await supabase.from("post_votes").insert({
			post_id: post_id,
			user_id: session.user.id,
			value: inputValue,
		});
		console.log("no value, insert");
	}

	return (
		<div
			key={post_id}
			className="card card-bordered flex flex-row border-secondary-focus gap-2 p-2 mb-4 hover:bg-secondary-content"
		>
			<div className="flex flex-col items-center">
				<form action={() => HandleVote(1)}>
					<button
						className={`btn btn-xs btn-square ${
							value === 1 ? "btn-success" : "btn-ghost"
						} hover:btn-success`}
					>
						🔼
					</button>
				</form>
				{total >= 0 ? total : 0}
				<form action={() => HandleVote(-1)}>
					<button
						className={`btn btn-xs btn-square ${
							value === -1 ? "btn-error" : "btn-ghost"
						} hover:btn-error`}
					>
						🔽
					</button>
				</form>
			</div>

			<div className="flex flex-col ">
				<Link
					className="link-secondary text-xl"
					href={`/post/${post_id}`}
				>
					{title}
				</Link>

				<p className="backdrop-blur w-full text-sm overflow-hidden text-ellipsis h-[5rem] backdrop-blur-gradient">
					{content}
				</p>
			</div>
		</div>
	);
}
