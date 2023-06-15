"use client";
import { useEffect } from "react";
import { themeChange } from "theme-change";

const DAISYUI_THEMES = ["lofi", "black", "forest", "garden", "wireframe"];

export default function ThemeDropdownContent() {
	useEffect(() => {
		themeChange(false);
	}, []);

	return (
		<div
			tabIndex={0}
			className="flex flex-col gap-3 p-3 bg-base-200 dropdown-content menu shadow rounded-box w-52 z-10 relative"
		>
			{DAISYUI_THEMES.map((theme) => (
				<button
					key={theme}
					value={theme}
					data-set-theme={theme}
					data-act-class="[&_svg]:visible"
					className="bg-base-100 text-base-content outline-base-content overflow-hidden rounded-lg text-left w-full"
				>
					<div className="w-full cursor-pointer">
						<div
							className="flex items-center gap-2 px-4 py-3"
							data-theme={theme}
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								strokeWidth={1.5}
								stroke="currentColor"
								className="invisible h-4 w-4 shrink-0"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									d="M4.5 12.75l6 6 9-13.5"
								/>
							</svg>

							<div className="text-sm flex-grow h-full">
								{theme}
							</div>
							<div className="flex h-4 flex-shrink-0 flex-wrap gap-1">
								<div className="w-2 rounded-full bg-primary" />
								<div className="w-2 rounded-full h-full bg-secondary" />
								<div className="w-2 rounded-full bg-accent" />
								<div className="w-2 rounded-full bg-neutral" />
							</div>
						</div>
					</div>
				</button>
			))}
		</div>
	);
}
