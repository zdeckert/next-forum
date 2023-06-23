import { PostWithJoins } from "@/lib/consts.types";
import Link from "next/link";
import PostVotes from "./post-votes";

export default function CompactPost({
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
		<div className="border-2 flex flex-row border-base-content gap-2 p-2 mb-4 hover:bg-base-200">
			<PostVotes postVotes={postVotes} postId={postId} />

			<div className="flex flex-col no-underline gap-2">
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
				<p className="w-full text-sm overflow-hidden text-ellipsis h-[5rem] backdrop-blur mask-linear">
					{content}
				</p>
			</div>
		</div>
	);
}
