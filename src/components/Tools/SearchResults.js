import React, { useContext, useEffect, useRef } from "react";

import { SearchContext } from "../../context/SearchContext";

export function SearchResultsLoading() {}

export default function SearchResults({
	searchFilesAndDirectories,
	page,
	searchRef,
}) {
	const { searchResults, setSearchResults } = useContext(SearchContext);
	const searchResultsRef = useRef();

	useEffect(() => {
		const searchResults = searchResultsRef.current;

		if (searchResults) {
			searchResults.addEventListener("scroll", (event) => {
				const { scrollTop, scrollHeight, clientHeight } = event.target;

				if (scrollTop + clientHeight >= scrollHeight) {
					page.current = page.current + 1;
					searchFilesAndDirectories(page.current);
				}
			});
		}
	}, []);

	return (
		<ul className="search-results" ref={searchResultsRef}>
			<div id="hide-search-results">
				<button
					onClick={() => {
						setSearchResults({
							files: [],
							directories: [],
						});

						searchRef.current.value = "";
					}}
				>
					Hide
				</button>
			</div>
			{searchResults.files.map((file) => {
				const { _id, fileName, url, hierarchy } = file;
				return (
					<li
						key={_id}
						className="file"
						onDoubleClick={() => (window.location.href = url)}
					>
						<p>{fileName}</p>
						<ul style={{ listStyleType: "none" }} className="path">
							{hierarchy.map((directory, index) => (
								<li
									key={index}
									className="path-element"
									onClick={() =>
										(window.location.href = `home?directory=${directory._id}`)
									}
								>
									{"> " + directory.directoryName.slice(0, 10) + "..."}
								</li>
							))}
						</ul>
					</li>
				);
			})}

			{searchResults.directories.map((directory) => {
				const { _id, directoryName, hierarchy } = directory;

				return (
					<li
						key={_id}
						className="file"
						onDoubleClick={() =>
							(window.location.href = `home?directory=${_id}`)
						}
					>
						<p>{directoryName}</p>
						<ul className="path" style={{ listStyleType: "none" }}>
							{hierarchy.map((directory, index) => (
								<li
									key={index}
									className="path-element"
									onClick={() =>
										(window.location.href = `home?directory=${directory._id}`)
									}
								>
									{"> " + directory.directoryName.slice(0, 10) + "..."}
								</li>
							))}
						</ul>
					</li>
				);
			})}
		</ul>
	);
}
