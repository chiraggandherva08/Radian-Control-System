import { useContext } from "react";
import { DataContext } from "../../context/DataContext";

import closeIcon from "../../assets/cross.svg";
import deleteIcon from "../../assets/delete.svg";
import downloadIcon from "../../assets/download.svg";

import "./style.css";
import axios from "axios";

export default function Operations() {
	const {
		selectedDirectories,
		selectedFiles,
		setSelectedFiles,
		setSelectedDirectories,
		setMessage,
	} = useContext(DataContext);

	async function deleteQueue() {
		for (let index = 0; index < selectedDirectories.length; index++) {
			const directoryId = selectedDirectories[index];

			try {
				const { data } = await axios.delete(
					`/directory/delete?directory=${directoryId}`,
					{
						headers: {
							Authorization: localStorage.getItem("token"),
						},
					}
				);

				if (data.success) {
					setMessage(data.message);
				} else {
					setMessage(`Error occurred in deleting directory ${directoryId}!`);
				}
			} catch (error) {
				setMessage("Error occurred in deleting directory!");
			}
		}

		for (let index = 0; index < selectedFiles.length; index++) {
			const fileId = selectedFiles[index];

			try {
				const { data } = await axios.delete(`/file/delete?file=${fileId}`, {
					headers: {
						Authorization: localStorage.getItem("token"),
					},
				});

				if (data.success) {
					setMessage(data.message);
				} else {
					setMessage(`Error occurred in deleting file ${fileId}!`);
				}
			} catch (error) {
				setMessage("Error occurred in deleting file!");
			}
		}

		setSelectedDirectories([]);
		setSelectedFiles([]);

		window.location.reload();
	}

	async function download() {
		for (let index = 0; index < selectedDirectories.length; index++) {
			const directoryId = selectedDirectories[index];

			setMessage({
				error: false,
				message: "Zipping directory...",
			});

			try {
				const data = await axios.get(
					`/directory/download?directory=${directoryId}`,
					{
						headers: {
							Authorization: localStorage.getItem("token"),
							"Content-Type": "application/zip",
						},
						responseType: "blob",
					}
				);

				const blob = new Blob([data.data], {
					type: "application/zip",
				});

				const url = window.URL.createObjectURL(blob);
				const a = document.createElement("a");

				a.download = "archive.zip";
				a.href = url;
				a.click();

				window.URL.revokeObjectURL(url);

				if (data.data) {
					setMessage({
						error: false,
						message: "Directory downloaded successfully!",
					});
				} else {
					setMessage({
						error: true,
						message: `Error occurred in downloading directory ${directoryId}!`,
					});
				}
			} catch (error) {
				setMessage("Error occurred in downloading directory!");
			}
		}
	}

	return (
		<ul id="operations">
			<li>
				<img
					src={closeIcon}
					alt={"Clear selection"}
					onClick={() => {
						setSelectedDirectories([]);
						setSelectedFiles([]);
					}}
				/>
			</li>

			<li>
				<img
					src={deleteIcon}
					onClick={() => deleteQueue()}
					alt={"Delete selected items"}
				/>
			</li>

			<li>
				<img
					src={downloadIcon}
					onClick={() => download()}
					alt={"Download selected items"}
				/>
			</li>
		</ul>
	);
}
