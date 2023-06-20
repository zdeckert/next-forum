import type { Database } from "@/lib/database.types";

type Post = Database["public"]["Tables"]["posts"]["Row"];

export interface PostWithJoins extends Post {
	channels: {
		name: string;
		slug: string;
	};
	post_votes: [
		{
			id: string;
			value: number;
			user_id: string;
		}
	];
	profiles: {
		username: string;
	};
}
