import { Fragment, useState, useContext, useRef } from "react";
import axios from "axios";

import searchIcon from "../../assets/search.svg";
import sortIcon from "../../assets/sort.svg";
import createIcon from "../../assets/create.svg";
import uploadIcon from "../../assets/upload.svg";

import UploadFile from "./UploadFile";
import CreateDirectory from "./CreateDirectory";
import Filter from "./Filter";

import { SearchContext } from "../../context/SearchContext";

import SearchResults from "./SearchResults";
import "./style.css";

export default function Tools() {
	const [createDirectory, setCreateDirectory] = useState(false);
	const [uploadFile, setUploadFile] = useState(false);
	const [filter, setFilter] = useState(false);
	const searchRef = useRef();
	const page = useRef(1);
	const { searchQuery, setSearchQuery, searchResults, setSearchResults } =
		useContext(SearchContext);

	async function searchFilesAndDirectories() {
		if (searchQuery === "" || !searchQuery) {
			return;
		}

		try {
			const { data } = await axios.get(
				`/search?q=${searchQuery}&page=${page.current}`,
				{
					headers: {
						Authorization: localStorage.getItem("token"),
					},
				}
			);

			if (data.success) {
				setSearchResults((prev) => ({
					files: [...prev.files, ...data.data.files],
					directories: [...prev.directories, ...data.data.directories],
				}));
			}
		} catch (error) {
			console.error(error);
		}
	}

	return (
		<Fragment>
			{createDirectory && (
				<CreateDirectory setCreateDirectory={setCreateDirectory} />
			)}

			{(searchResults.files.length > 0 ||
				searchResults.directories.length > 0) && (
				<SearchResults
				searchRef={searchRef}
					page={page}
					searchFilesAndDirectories={searchFilesAndDirectories}
				/>
			)}

			{uploadFile && <UploadFile setUploadFile={setUploadFile} />}

			{filter && <Filter setFilter={setFilter} />}

			<div className="toolbar">
				<div id="search">
					<input
						ref={searchRef}
						id="search-input"
						type="text"
						placeholder="Search file or folder"
						onChange={(e) => setSearchQuery(e.target.value)}
					/>
					<img
						id="search-icon"
						src={searchIcon}
						alt="search"
						onClick={() => {
							searchFilesAndDirectories();
						}}
					/>
				</div>

				<div className="mobile-toolbar">
					<button
						id="sorter"
						onClick={() => {
							setFilter((prev) => !prev);
						}}
					>
						<img src={sortIcon} alt="directory icon" />
					</button>

					<button
						id="create-directory-button"
						onClick={() => {
							setCreateDirectory((prev) => !prev);
						}}
					>
						<img src={createIcon} alt="Create" />
					</button>

					{new URLSearchParams(window.location.search).get("directory") && (
						<button
							id="upload-file-button"
							onClick={() => {
								setUploadFile((prev) => !prev);
							}}
						>
							<img src={uploadIcon} alt="Upload" />
						</button>
					)}
				</div>
			</div>
		</Fragment>
	);
}
