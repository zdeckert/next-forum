import { PostWithJoins } from "@/lib/consts.types";
import Link from "next/link";
import { useAuth } from "../auth";
import Comments from "./comments";
import Votes from "./votes";

export default function Post({
	post: {
		channels: { name: channelName, slug: channelSlug },
		content,
		id: postId,
		post_votes,
		profiles: { username },
		title,
	},
}: {
	post: PostWithJoins;
}) {
	const { session } = useAuth();

	const { id: voteId, value: userVote } = post_votes?.find(
		({ user_id }) => user_id === session?.user.id
	) || { id: undefined, value: undefined };

	const total = post_votes?.reduce((acc, { value }) => acc + value, 0);

	const votes = { total, voteId, userVote };

	return (
		<div className="border-2 flex border-base-content gap-2 p-2 mb-4">
			<Votes votes={votes} postId={postId} />

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
