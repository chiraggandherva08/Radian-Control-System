import { useState, useContext, useRef } from "react";
import { DataContext } from "../../context/DataContext";
import axios from "axios";

export function ProgressBar() {
	const { uploadingFileProgress } = useContext(DataContext);
	const fileNameSplit = uploadingFileProgress.fileName.split(".");

	return (
		<ul id="progress-bar">
			<p>{`${uploadingFileProgress.track} | ${
				fileNameSplit[0].length > 10
					? fileNameSplit[0].slice(0, 7) + "..."
					: fileNameSplit[0]
			}.${fileNameSplit.pop()}`}</p>
			<div id="progress-parent">
				<div
					id="progress"
					style={{
						width: `${uploadingFileProgress.progress}%`,
					}}
				></div>
			</div>
			<p style={{ fontSize: "12px", color: "gray" }}>{`${
				uploadingFileProgress.progress
			}% > ${
				uploadingFileProgress.progress === 100 ? "Processing Your File" : ""
			}`}</p>
		</ul>
	);
}

export default function UploadFile({ setUploadFile }) {
	const [ACL, setACL] = useState("private");
	const uploadFiles = useRef();
	const uploadDirectory = useRef();
	const { setMessage, setUploadingFileProgress } = useContext(DataContext);

	async function handleUpload(e) {
		e.preventDefault();

		let form = null;
		let url = null;

		if (uploadFiles.current.files.length > 0) {
			form = uploadFiles.current;
			url = "/file/upload";
		}
		if (uploadDirectory.current.files.length > 0) {
			form = uploadDirectory.current;
			url = "/directory/upload";
		}

		if (form.files.length === 0) {
			setMessage({
				error: true,
				message: "Please select a file or folder",
			});
			return;
		}

		if (!form.files) {
			return;
		}

		for (let i = 0; i < form.files.length; i++) {
			const formData = new FormData();
			formData.append("file", form.files[i]);

			if (form.files[i].name === ".DS_Store") {
				continue;
			}

			try {
				const params = new URLSearchParams(window.location.search);
				const directoryId = params.get("directory");

				const path = form.files[i].webkitRelativePath
					? form.files[i].webkitRelativePath
					: form.files[i].relativePath;

				if (form.files[i].size > 500 * 1024 * 1024) {
					// 500MB
					setMessage({
						error: true,
						message: "File size exceeds 500MB!",
					});
					continue;
				}

				const { data } = await axios.put(
					`${url}?directory=${directoryId}&ACL=${ACL}&filepath=${path}`,
					formData,
					{
						onUploadProgress: (progressEvent) => {
							const percentCompleted = Math.round(
								(progressEvent.loaded * 100) / progressEvent.total
							);

							setUploadingFileProgress(() => ({
								fileName: form.files[i].name,
								progress: percentCompleted,
								track: `Uploaded ${i + 1} / ${form.files.length} files`,
							}));
						},
						headers: {
							Authorization: localStorage.getItem("token"),
						},
					}
				);

				if (data?.success) {
					setUploadingFileProgress(null);
					setMessage({
						error: false,
						message: `${form.files[i].name} uploaded successfully!`,
					});
				} else {
					setMessage({
						error: true,
						message: "Failed to upload file!",
					});
				}
			} catch (error) {
				setUploadingFileProgress(null);
				setMessage({
					error: true,
					message: "Failed to upload file!",
				});
			}
		}

		setTimeout(() => {
			window.location.reload();
		}, 1000);
	}

	return (
		<div className="backdrop">
			<form
				id="upload-file"
				onSubmit={(e) => {
					handleUpload(e);
				}}
			>
				<label id="custom-file-upload" htmlFor="upload-folder">
					Select Folder
				</label>

				<input
					ref={uploadDirectory}
					type="file"
					id="upload-folder"
					multiple={true}
					webkitdirectory=""
					directory=""
				/>

				<hr />

				<label id="custom-file-upload" htmlFor="upload-files">
					Select Files
				</label>
				<input
					ref={uploadFiles}
					type="file"
					id="upload-files"
					multiple={true}
				/>

				<hr />
				<div>
					<span>Applied to all</span>
					<select
						defaultValue={"private"}
						onChange={(e) => {
							setACL(e.target.value);
						}}
					>
						<option value="private">Private</option>
						<option value="public-read">Public</option>
					</select>
				</div>
				<hr />
				<div>
					<button
						type="submit"
						style={{
							backgroundColor: "#446ab7",
							color: "white",
						}}
						onClick={() => {
							setTimeout(() => {
								setUploadFile(false);
							}, 100);
						}}
					>
						Upload
					</button>
					<button
						style={{ backgroundColor: "#e92424", color: "white" }}
						onClick={() => {
							setUploadFile(false);
						}}
					>
						Cancel
					</button>
				</div>
			</form>
		</div>
	);
}
