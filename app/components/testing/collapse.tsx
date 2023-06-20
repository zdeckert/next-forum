export default function DataCollapse({ data }: { data: any }) {
	return (
		<div className="collapse bg-base-200">
			<input type="checkbox" />
			<div className="collapse-title text-xl font-medium">
				{`Is data: ${!!data}`}
			</div>
			<div className="collapse-content">
				<pre>{JSON.stringify(data, null, 2)}</pre>
			</div>
		</div>
	);
}
