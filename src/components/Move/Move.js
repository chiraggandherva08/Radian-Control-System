import React, { useContext, useEffect, useState } from "react";
import "./style.css";

import directoryIcon from "../../assets/directory.svg";
import axios from "axios";
import { DataContext } from "../../context/DataContext";

export default function Move({ setShowMove }) {
	const [directories, setDirectories] = useState([]);
	const [hierarchy, setHierarchy] = useState([]);
	const [directoryId, setDirectoryId] = useState(
		new URLSearchParams(window.location.search).get("directory")
	);

	const { directoryId: selectedDirectory } = useContext(DataContext);

	async function moveDirectory() {
		try {
			const { data } = await axios.patch(
				`/directory/move?directory=${selectedDirectory}&newParentDirectory=${directoryId}`,
				{},
				{
					headers: {
						Authorization: localStorage.getItem("token"),
					},
				}
			);

			if (data.success) {
				setTimeout(() => {
					window.location.reload();
				}, 1000);
			}
		} catch (error) {
			console.error(error);
		}
	}

	useEffect(() => {
		async function fetchDirectories() {
			try {
				const { data } = await axios.get(
					`/directory?directory=${directoryId}`,
					{
						headers: {
							Authorization: localStorage.getItem("token"),
						},
					}
				);

				if (data.success) {
					setDirectories(data.data.directories);
					setHierarchy(data.data.hierarchy);
				}
			} catch (error) {
				console.error(error);
			}
		}

		fetchDirectories();
	}, [directoryId]);

	return (
		<div className="backdrop">
			<div id="move-item">
				<span
					style={{
						cursor: "pointer",
						color: "rgb(21, 43, 113)",
						marginBottom: "10px",
					}}
					onClick={() => setShowMove(false)}
				>
					{"< cancel"}
				</span>

				<h3>Move Directory</h3>

				<ul id="move-item-navigation">
					{hierarchy.map((directory) => (
						<li
							key={directory._id}
							onClick={() => {
								setDirectoryId(directory._id);
							}}
						>
							{directory.directoryName.length > 10
								? directory.directoryName.slice(0, 10) + "..."
								: directory.directoryName}{" "}
							{" > "}
						</li>
					))}
				</ul>

				<ul id="move-item-directories">
					{directories.map((directory) => (
						<li
							key={directory._id}
							onDoubleClick={() => {
								setDirectoryId(directory._id);
							}}
						>
							<img src={directoryIcon} alt="directory" />
							<span>
								{directory.directoryName.length > 10
									? directory.directoryName.slice(0, 10) + "..."
									: directory.directoryName}
							</span>
						</li>
					))}
				</ul>

				<div id="move-here">Move Here</div>

				<button
					id="confirm-move"
					onClick={() => {
						moveDirectory();
					}}
				>{`Move Inside ${
					hierarchy[hierarchy.length - 1]
						? hierarchy[hierarchy.length - 1].directoryName
						: ""
				}`}</button>
			</div>
		</div>
	);
}
