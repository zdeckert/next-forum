import Login from "@/components/login";
import Image from "next/image";
import NextIcon from "../public/next-icon.ico";
import "./globals.css";

export const metadata = {
	title: "Next Forum",
	description: "Next Forum",
};

export default async function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en">
			<body>
				<nav className="navbar border-b-2 border-primary bg-primary text-primary-content">
					<div className="navbar-start ">
						<a href="/">
							<div className="flex align-center gap-2 justify-center">
								<Image
									src={NextIcon}
									alt="Next Icon"
									className="w-6 h-6"
								/>
								<p className="max-sm:hidden font-semibold ">
									Next Forums
								</p>
							</div>
						</a>
					</div>
					<div className="navbar-end">
						<Login />
					</div>
				</nav>
				<div className="grid gap-2 grid-cols-12 w-screen min-h-screen-nonav">
					<div className="row-span-full col-span-full sm:col-start-2 sm:col-end-12 md:col-start-3 md:col-end-11">
						{children}
					</div>
				</div>
			</body>
		</html>
	);
}
