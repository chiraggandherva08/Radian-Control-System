import { Fragment, useContext } from "react";
import { DataContext } from "../../context/DataContext";

import backIcon from "../../assets/more.svg";
import Operations from "./Operations";

export default function Pagination({ title }) {
	const { totalPages, page, setPage, selectedFiles, selectedDirectories } =
		useContext(DataContext);

	return (
		<Fragment>
			<div className="pagination">
				<p
					className={`${title ? "" : "loading-title"}`}
					style={{ fontWeight: "bolder", minWidth: "70px" }}
				>
					{title}
				</p>
				<img
					style={{ rotate: "180deg" }}
					alt="prev"
					src={backIcon}
					onClick={() => {
						if (page > 1) setPage(page - 1);
					}}
				/>
				{Array.from({ length: totalPages }, (_, pageNumber) => {
					return (
						<li
							key={pageNumber}
							onClick={() => {
								setPage(pageNumber + 1);
							}}
							className={`pagination-page ${
								page === pageNumber + 1 ? "pagination-active" : ""
							}`}
						>
							{pageNumber + 1}
						</li>
					);
				})}
				<img
					src={backIcon}
					alt="next"
					onClick={() => {
						if (page < totalPages) setPage(page + 1);
					}}
				/>
			</div>
			{(selectedFiles.length > 0 || selectedDirectories.length > 0) && (
				<Operations />
			)}
		</Fragment>
	);
}
