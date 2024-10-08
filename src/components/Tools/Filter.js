import crossIcon from "../../assets/cross.svg";

import { useContext } from "react";
import { DataContext } from "../../context/DataContext";

export default function Filter({ setFilter }) {
	const { setSort, setOrder, setLimit, order, sort, limit } =
		useContext(DataContext);

	return (
		<div className="backdrop">
			<ul id="filter">
				<img
					src={crossIcon}
					alt="close filters"
					onClick={() => setFilter(false)}
				/>
				<h2>Filter</h2>
				<div>
					<div>
						<label>Sort Order</label>

						<select
							defaultValue={order}
							onChange={(e) => {
								setOrder(e.target.value);
								localStorage.setItem("sorting_order", e.target.value);
							}}
						>
							<option value={1}>Ascending</option>
							<option value={-1}>Descending</option>
						</select>
					</div>

					<hr />

					<div>
						<label>Sort By</label>
						<select
							defaultValue={sort}
							onChange={(e) => {
								setSort(e.target.value);
								localStorage.setItem("sorting", e.target.value);
							}}
						>
							<option value="directory">Directory Name</option>
							<option value="creation">Creation Time</option>
						</select>
					</div>

					<hr />

					<div>
						<label>Limit</label>
						<select
							defaultValue={limit}
							onChange={(e) => {
								setLimit(e.target.value);
								localStorage.setItem("limit", e.target.value);
							}}
						>
							<option value={5}>5</option>
							<option value={10}>10</option>
							<option value={20}>20</option>
							<option value={50}>50</option>
							<option value={100}>100</option>
						</select>
					</div>
				</div>
			</ul>
		</div>
	);
}
