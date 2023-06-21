"use client";

import { Database } from "@/lib/database.types";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Session, User } from "@supabase/supabase-js";
import { createContext, useContext, useEffect, useState } from "react";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];

const supabase = createClientComponentClient();

const AuthContext = createContext<{
	session: Session | null | undefined;
	signOut: () => void;
	user: User | null | undefined;
	profile: Profile | null | undefined;
}>({
	session: null,
	signOut: () => {},
	user: null,
	profile: null,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
	const [user, setUser] = useState<User>();
	const [session, setSession] = useState<Session | null>(null);
	const [profile, setProfile] = useState<Profile | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		async function setData() {
			const {
				data: { session },
			} = await supabase.auth.getSession();

			setSession(session);
			setUser(session?.user);
			if (session) {
				const { data: profile } = await supabase
					.from("profiles")
					.select("*")
					.eq("id", session?.user.id)
					.single();
				setProfile(profile as Profile);
			}

			setLoading(false);
		}

		const { data: listener } = supabase.auth.onAuthStateChange(
			(_event, session) => {
				setSession(session);
				setUser(session?.user);
				setLoading(false);
			}
		);

		setData();

		return () => {
			listener?.subscription.unsubscribe();
		};
	}, []);

	const value = {
		session,
		signOut: () => supabase.auth.signOut(),
		user,
		profile,
	};

	// use a provider to pass down the value
	return (
		<AuthContext.Provider value={value}>
			{!loading && children}
		</AuthContext.Provider>
	);
}

export function useAuth() {
	return useContext(AuthContext);
}
