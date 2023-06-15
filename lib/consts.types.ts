import type { Database } from "@/lib/database.types";

type Post = Database["public"]["Tables"]["posts"]["Row"];

export type PostVoteHash = {
	[key: string]: {
		serverTotal: number;
		id?: string;
		value?: number;
	};
};

export type ChannelHash = {
	[key: string]: string;
};

export interface ServerPost extends Post {
	channels: {
		name: string;
	};
	post_votes: {
		total: number;
		userVote: number;
		voteId: string;
	};
	profiles: {
		username: string;
	};
}
