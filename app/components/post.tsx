import type { Database } from "@/lib/database.types";
import Link from "next/link";
type Post = Database["public"]["Tables"]["posts"]["Row"];

export default function Post({
	post: { content, downvotes, id, title, upvotes },
	isLoggedIn,
	handleUpvote,
	handleDownvote,
}: {
	post: Post;
	isLoggedIn: boolean;
	handleUpvote: Function;
	handleDownvote: Function;
}) {
	function onUpvote() {
		isLoggedIn
			? handleUpvote(id, upvotes)
			: /* @ts-expect-error */
			  window.login_modal.showModal();
		console.log(`Upvote ${id} ${upvotes}`);
	}
	function onDownvote() {
		isLoggedIn
			? handleDownvote(id, downvotes)
			: /* @ts-expect-error */
			  window.login_modal.showModal();
		console.log("Downvote!");
	}
	return (
		<div
			key={id}
			className="card card-bordered flex flex-row border-secondary-focus gap-2 p-2 mb-4 hover:bg-secondary-content"
		>
			<div className="flex flex-col items-center">
				<button
					className="btn btn-xs btn-square btn-ghost btn-success hover:btn-success"
					onClick={onUpvote}
				>
					⬆
				</button>
				{upvotes - downvotes}
				<button
					className="btn btn-xs btn-square btn-ghost hover:btn-error"
					onClick={onDownvote}
				>
					⬇
				</button>
			</div>
			<div className="flex flex-col ">
				<Link className="link-secondary text-xl" href={`/post/${id}`}>
					{title}
				</Link>

				<p className="backdrop-blur w-full text-sm overflow-hidden text-ellipsis h-[5rem] backdrop-blur-gradient">
					{content}
				</p>
			</div>
		</div>
	);
}
