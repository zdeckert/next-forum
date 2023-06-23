import { PostWithJoins } from "@/lib/consts.types";
import Link from "next/link";
import CommentVotes from "./comment-votes";
import Comments from "./comments";

export default function Post({
	post: {
		channels: { name: channelName, slug: channelSlug },
		content,
		id: postId,
		post_votes: postVotes,
		profiles: { username },
		title,
	},
}: {
	post: PostWithJoins;
}) {
	return (
		<div className="border-2 flex border-base-content gap-2 p-2 mb-4">
			<CommentVotes postVotes={postVotes} postId={postId} />

			<div className="flex flex-col gap-2">
				<p>
					Posted in{" "}
					<Link
						href={`/c/${channelSlug}`}
						className="link link-hover"
					>
						{channelName}.
					</Link>
					. Author: {username}
				</p>

				<Link href={`/c/${channelSlug}/post/${postId}`}>
					<p className="text-xl leading-5 link link-hover">{title}</p>
				</Link>

				<p className="w-full text-sm">{content}</p>
				<Comments postId={postId} />
			</div>
		</div>
	);
}
