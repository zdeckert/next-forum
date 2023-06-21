"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Session, User } from "@supabase/supabase-js";
import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext<{
	session: Session | null | undefined;
	signOut: () => void;
	user: User | null | undefined;
}>({
	session: null,
	signOut: () => {},
	user: null,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
	const [user, setUser] = useState<User>();
	const [session, setSession] = useState<Session | null>(null);
	const [loading, setLoading] = useState(true);

	const supabase = createClientComponentClient();

	useEffect(() => {
		async function setData() {
			const {
				data: { session },
			} = await supabase.auth.getSession();
			setSession(session);
			setUser(session?.user);
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
	}, [session, setUser]);

	const value = {
		session,
		signOut: () => supabase.auth.signOut(),
		user,
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
