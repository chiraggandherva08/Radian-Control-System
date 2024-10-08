import "./style.css";
import { Fragment, useContext, useEffect, useRef, useState } from "react";
import axios from "axios";
import deleteIcon from "../../assets/delete.svg";
import renameIcon from "../../assets/rename.svg";
import copyIcon from "../../assets/copy.svg";
import visibilityIcon from "../../assets/visibility.svg";
import moveIcon from "../../assets/move.svg";
import moreIcon from "../../assets/more.svg";
import { DataContext } from "../../context/DataContext";

async function deleteFile(fileId) {
	if (!fileId) {
		return;
	}

	try {
		const { data } = await axios.delete(`/file/delete?file=${fileId}`, {
			headers: {
				Authorization: localStorage.getItem("token"),
			},
		});

		if (data?.success) {
			setTimeout(() => {
				window.location.reload();
			}, 1000);
		}
	} catch (error) {
		console.error(error);
	}
}

async function toggleACL(fileId) {
	if (!fileId) {
		return;
	}
	try {
		const { data } = await axios.patch(
			`/file/acl?file=${fileId}`,
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

async function generateLink(fileId) {
	if (!fileId) {
		return;
	}
	try {
		const { data } = await axios.get(`/file/get-signed?file=${fileId}`, {
			headers: {
				Authorization: localStorage.getItem("token"),
			},
		});

		navigator.clipboard.writeText(data?.data?.url);
	} catch (error) {
		console.error(error);
	}
}

async function renameFile(fileId, fileName, setMessage) {
	if (!fileId || !fileName || fileName === "") {
		setMessage({
			error: true,
			message: "Please enter a valid file name",
		});
		return;
	}

	try {
		const { data } = await axios.patch(
			`/file/rename?file=${fileId}&newFileName=${fileName}`,
			{},
			{
				headers: {
					Authorization: localStorage.getItem("token"),
				},
			}
		);

		if (data?.success) {
		}
	} catch (error) {
		console.error(error);
	}
}

async function moveFile(fileId, directoryId) {
	if (!fileId || !directoryId) {
		return;
	}

	try {
		const { data } = await axios.patch(
			`/file/move?file=${fileId}&targetDirectory=${directoryId}`,
			{},
			{
				headers: {
					Authorization: localStorage.getItem("token"),
				},
			}
		);

		if (data?.success) {
			setTimeout(() => {
				window.location.reload();
			}, 1000);
		}
	} catch (error) {
		console.error(error);
	}
}

export default function ActionsFile({ setShowFileActions, X, Y, setShowMove }) {
	const { setMessage, selectedFile } = useContext(DataContext);
	const [fileName, setFileName] = useState("");
	// const moveFileList = useRef();
	const actionsFileRef = useRef();

	useEffect(() => {
		if (actionsFileRef.current) {
			actionsFileRef.current.style.left = X + window.scrollX + "px";
			actionsFileRef.current.style.top = Y + window.scrollY + "px";
		}
	}, []);

	return (
		<Fragment>
			<ul
				ref={actionsFileRef}
				className="actions"
				onMouseLeave={() => {
					setShowFileActions(false);
				}}
			>
				<li
					onClick={() => {
						setShowMove(true);
					}}
				>
					<img src={moveIcon} alt="move" />
					Move To
				</li>
				<li
					onClick={() => {
						toggleACL(selectedFile._id);
					}}
				>
					<img src={visibilityIcon} alt="ACL" />
					{selectedFile?.ACL === "private" ? "Make Public" : "Make Private"}
				</li>
				{selectedFile?.ACL === "private" ? (
					<li
						onClick={() => {
							generateLink(selectedFile._id);
						}}
					>
						<img src={copyIcon} alt="ACL" />
						Generate Link
					</li>
				) : null}
				<li
					onClick={() => {
						navigator.clipboard.writeText(selectedFile.url);
					}}
				>
					<img src={copyIcon} alt="ACL" />
					Copy Original Link
				</li>
				<hr className="actions-hr" />
				<li>
					<img src={renameIcon} alt="rename" />
					<input
						onKeyDown={(e) => {
							if (e.key === "Enter") {
								renameFile(
									selectedFile._id,
									fileName.trim().toLowerCase(),
									setMessage
								);
							}
						}}
						onChange={(e) => {
							setFileName(e.target.value.trim().toLowerCase());
						}}
						placeholder="Rename"
						id="rename-file"
					/>
				</li>
				<hr className="actions-hr" />
				<li
					onClick={() => {
						deleteFile(selectedFile._id);
					}}
				>
					<img src={deleteIcon} alt="delete" />
					Delete
				</li>
			</ul>
		</Fragment>
	);
}
