import { Inter } from "next/font/google";
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
				{/* @ts-expect-error next version of TS will fix this */}
				<Login />
				{children}
			</body>
		</html>
	);
}
