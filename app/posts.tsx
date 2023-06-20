"use client";

import { AuthProvider } from "@/components/auth";
import Post from "@/components/post";
import { PostWithJoins } from "@/lib/consts.types";

export default function Posts({ posts }: { posts: PostWithJoins[] }) {
	return (
		<AuthProvider>
			{posts.map((post) => (
				<Post key={post.id} post={post} />
			))}
		</AuthProvider>
	);
}
