import type { Database } from "@/lib/database.types";
import ArrowDown from "@/public/arrow-down.svg";
import ArrowUp from "@/public/arrow-up.svg";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useAuth } from "./auth";
type Post = Database["public"]["Tables"]["posts"]["Row"];

export default function Post({
	post: { content, id: postId, title },
	serverVote: { id: serverVoteId, serverTotal, value },
	channelName,
}: {
	post: Post;
	serverVote: {
		id?: string;
		serverTotal: number;
		value?: number;
	};
	channelName: string;
}) {
	const [voteId, setVoteId] = useState(serverVoteId);
	const [vote, setVote] = useState(value);
	const [total, setTotal] = useState(serverTotal);
	const supabase = createClientComponentClient();

	const { session } = useAuth();
	async function HandleVote(inputValue: number) {
		// if no session, show pop up
		if (!session) {
			/* @ts-expect-error */
			window.login_modal.showModal();
			return;
		}

		// if session with vote, pressing same button, remove vote
		if (vote === inputValue) {
			await supabase.from("post_votes").delete().eq("id", voteId);
			setTotal(total - inputValue);
		}

		// if session with vote, update existing vote
		if (vote && vote !== inputValue) {
			await supabase
				.from("post_votes")
				.update({ value: inputValue })
				.eq("id", voteId);
			setTotal(total + 2 * inputValue);
		}

		// if session with no vote, insert new vote
		// save new vote id for further update, deletes, etc
		if (vote === undefined) {
			const { data, error } = await supabase
				.from("post_votes")
				.insert({
					post_id: postId,
					user_id: session!.user.id,
					value: inputValue,
				})
				.select();
			setVoteId(data![0].id);
			setTotal(total + inputValue);
		}
		vote === inputValue ? setVote(undefined) : setVote(inputValue);
	}

	return (
		<div
			key={postId}
			className="border-[1px] flex flex-row border-secondary-focus gap-2 p-2 mb-4 hover:bg-base-200"
		>
			<div className="flex flex-col items-center">
				<form action={() => HandleVote(1)}>
					<button
						className={`btn btn-xs btn-circle ${
							vote === 1 ? "btn-success" : ""
						} hover:btn-success`}
					>
						<Image src={ArrowUp} alt="upvote icon" />
					</button>
				</form>
				{total >= 0 ? total : 0}
				<form action={() => HandleVote(-1)}>
					<button
						className={`btn btn-xs btn-circle hover:btn-error stroke-primary-content ${
							vote === -1 ? "btn-error" : "btn-secondary"
						} `}
					>
						<Image src={ArrowDown} alt="downvote icon" />
					</button>
				</form>
			</div>
			<Link className="link-secondary text-xl" href={`/post/${postId}`}>
				<div className="flex flex-col ">
					{title}

					<p className="backdrop-blur w-full text-sm overflow-hidden text-ellipsis h-[5rem] backdrop-blur-gradient">
						{content}
					</p>
				</div>
			</Link>
		</div>
	);
}
