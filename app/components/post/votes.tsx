import { useAuth } from "@/components/auth";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useState } from "react";

export default function Votes({
	votes: { total: intialTotal, userVote, voteId: intialVoteId },
	postId,
}: {
	votes: {
		total: number;
		userVote?: number;
		voteId?: string;
	};
	postId: string;
}) {
	const [voteId, setVoteId] = useState(intialVoteId);
	const [vote, setVote] = useState(userVote || undefined);
	const [total, setTotal] = useState(intialTotal);

	const { session } = useAuth();
	const supabase = createClientComponentClient();

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
					user_id: session.user.id,
					value: inputValue,
				})
				.select();

			setVoteId(data![0].id);
			setTotal(total + inputValue);
		}
		vote === inputValue ? setVote(undefined) : setVote(inputValue);
	}

	return (
		<div className="flex flex-col items-center">
			<button
				onClick={() => HandleVote(1)}
				className={`btn btn-xs btn-circle ${
					vote === 1 ? "btn-success" : ""
				} hover:btn-success`}
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					strokeWidth="1.5"
					stroke="currentColor"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						d="M15 11.25l-3-3m0 0l-3 3m3-3v7.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
					/>
				</svg>
			</button>
			<div>{total >= 0 ? total : 0}</div>
			<button
				onClick={() => HandleVote(-1)}
				className={`btn btn-xs btn-circle hover:btn-error stroke-primary-content ${
					vote === -1 ? "btn-error" : ""
				} `}
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					strokeWidth="1.5"
					stroke="currentColor"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						d="M9 12.75l3 3m0 0l3-3m-3 3v-7.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
					/>
				</svg>
			</button>
		</div>
	);
}
