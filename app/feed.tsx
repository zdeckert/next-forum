"use client";

import { AuthProvider } from "@/components/auth";
import CompactPost from "@/components/post/compact-post";
import { PostWithJoins } from "@/lib/consts.types";

export default function Feed({ posts }: { posts: PostWithJoins[] }) {
	return (
		<AuthProvider>
			{posts.map((post) => (
				<CompactPost key={post.id} post={post} />
			))}
		</AuthProvider>
	);
}
