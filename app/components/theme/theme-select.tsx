"use client";
import { useEffect, useState } from "react";
import { themeChange } from "theme-change";

const DAISYUI_THEMES = ["lofi", "black", "forest", "garden", "wireframe"];

export default function ClientTheme() {
	const defaultTheme = window.localStorage.getItem("theme") || "lofi";
	const [theme, setTheme] = useState(defaultTheme);
	useEffect(() => {
		themeChange(false);
		// 👆 false parameter is required for react project
	}, []);
	return (
		<select
			className="select select-sm select-bordered w-full max-w-xs text-base-content"
			value={theme}
			onChange={(e) => setTheme(e.target.value)}
		>
			{DAISYUI_THEMES.map((theme) => (
				<option key={theme} value={theme} data-set-theme={theme}>
					{theme}
				</option>
			))}
		</select>
	);
}
