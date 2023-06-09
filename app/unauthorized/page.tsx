import LoginForm from "@/components/login-form";

export default async function Unathorized() {
	return (
		<>
			<h2>{`Unathorized. Try logging in or creating account to view that content.`}</h2>
			{/* @ts-expect-error Server Component */}
			<LoginForm />
		</>
	);
}
