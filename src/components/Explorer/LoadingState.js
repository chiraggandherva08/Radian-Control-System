import { Fragment, useContext, useRef } from "react";
import Pagination from "../Tools/Pagination";
import { DataContext } from "../../context/DataContext";

export default function LoadingState() {
	const dirColumns = useRef([
		"Name",
		"Creator",
		"Shared",
		"Created",
		"Actions",
	]);

	const { limit } = useContext(DataContext);
	const rows = useRef(Array.from({ length: limit }));

	return (
		<Fragment>
			<Pagination title={null} />
			<table className="explorer directories">
				<thead>
					<tr>
						{dirColumns.current.map((column, index) => (
							<th
								key={index}
								style={{
									width: index === dirColumns.length - 1 ? "auto" : "100px",
									textAlign: index === dirColumns.length - 1 ? "right" : "left",
								}}
							>
								{column}
							</th>
						))}
					</tr>
				</thead>
			</table>
			{rows.current.map((_, index) => (
				<div className="loading-state" key={index}>
					<div
						className="loader"
						style={{ animationDelay: `${index / 100}s` }}
					></div>
				</div>
			))}
		</Fragment>
	);
}
