export default function LoginModal({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<dialog id="login_modal" className="modal ">
			{children}
		</dialog>
	);
}
