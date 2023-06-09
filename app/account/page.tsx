import {
	Session,
	createServerComponentClient,
} from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import AccountForm from "./account-form";

export default async function Account() {
	const supabase = createServerComponentClient({ cookies });

	const {
		data: { session },
	} = await supabase.auth.getSession();

	if (!session) {
		redirect("/unauthorized");
	}

	return (
		<div className="w-full h-full flex justify-center items-center">
			<AccountForm session={session as Session} />
			{/* <div className="collapse bg-base-200">
				<input type="checkbox" />
				<div className="collapse-title text-xl font-medium">
					{`Is session: ${!!session}`}
				</div>
				<div className="collapse-content">
					<pre>{JSON.stringify(session, null, 2)}</pre>
				</div>
			</div> */}
		</div>
	);
}
