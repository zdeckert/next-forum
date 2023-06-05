import { Inter } from "next/font/google";
import Image from "next/image";
import NextIcon from "../public/next-icon.ico";
import "./globals.css";
import Login from "./login";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
	title: "Next Forum",
	description: "Next Forum",
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en">
			<body>
				<nav className="navbar border-b-2 border-primary bg-primary text-primary-content">
					<div className="navbar-start">
						<a href="/">
							<Image
								src={NextIcon}
								alt="Next Icon"
								className="w-8 h-8"
							/>
						</a>
						<p className="pl-2 ">Next Forums</p>
					</div>
					<div className="navbar-end">
						{/* @ts-expect-error next version of TS will fix this */}
						<Login />
					</div>
				</nav>
				<div className="p-4">{children}</div>
			</body>
		</html>
	);
}
