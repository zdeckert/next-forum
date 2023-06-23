import { PostWithJoins } from "@/lib/consts.types";
import Link from "next/link";
import PostVotes from "./post-votes";

export default function CompactPost({
	post: {
		channels: { name: channelName, slug: channelSlug },
		content,
		id: postId,
		post_votes: postVotes,
		profiles: { avatar_url: avatarUrl, username: author },
		title,
	},
}: {
	post: PostWithJoins;
}) {
	return (
		<div className="border-2 flex flex-row border-base-content gap-2 p-2 mb-4 hover:bg-base-200">
			<PostVotes postVotes={postVotes} postId={postId} />

			<div className="flex flex-col no-underline gap-2">
				<div className="flex gap-1">
					<p>Posted in</p>
					<Link
						href={`/c/${channelSlug}`}
						className="link link-hover"
					>
						{channelName}
					</Link>
					<p>by</p>
					<p>{author}</p>
				</div>
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
