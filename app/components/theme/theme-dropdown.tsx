"use server";

import ClientTheme from "./theme-select";

export default async function ThemeDropdown() {
	return (
		<div>
			<div className="dropdown dropdown-end">
				<label tabIndex={0} className="btn btn-sm m-1">
					Theme
				</label>
				<div
					tabIndex={0}
					className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52"
				>
					<ClientTheme />
				</div>
			</div>
		</div>
	);
}
