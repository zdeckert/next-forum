import { useAuth } from "@/components/auth/client-auth";
import AccountForm from "./account-form";

export default async function Account() {
  const { session } = useAuth();

  return (
    <div className="w-full h-full flex justify-center items-center">
      <AccountForm session={session!} />
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
