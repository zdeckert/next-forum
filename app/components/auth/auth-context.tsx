import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Session, SupabaseClient, User } from "@supabase/supabase-js";
import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext<{
	session: Session | null | undefined;
	signOut: () => void;
	supabase: SupabaseClient | null;
	user: User | null | undefined;
}>({
	session: null,
	signOut: () => {},
	supabase: null,
	user: null,
});

export default function AuthProvider({
	children,
}: {
	children: React.ReactNode;
}) {
	const [user, setUser] = useState<User>();
	const [session, setSession] = useState<Session | null>();
	const [loading, setLoading] = useState(true);

	const supabase = createClientComponentClient();

	useEffect(() => {
		const setData = async () => {
			const {
				data: { session },
				error,
			} = await supabase.auth.getSession();
			if (error) throw error;
			setSession(session);
			setUser(session?.user);
			setLoading(false);
		};

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
	}, [setUser, supabase.auth]);

	const value = {
		session,
		signOut: () => supabase.auth.signOut(),
		supabase,
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
