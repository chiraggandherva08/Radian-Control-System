import shareIcon from "../../assets/share.svg";
import deleteIcon from "../../assets/delete.svg";
import renameIcon from "../../assets/rename.svg";
import pinIcon from "../../assets/pin.svg";
import moreIcon from "../../assets/more.svg";
import manageAccessIcon from "../../assets/access.svg";
import moveIcon from "../../assets/move.svg";

import Share from "./Share";
import { Fragment, useContext, useEffect, useRef, useState } from "react";
import axios from "axios";
import { DataContext } from "../../context/DataContext";
import "./style.css";

async function deleteDirectory(directoryId, setMessage) {
	if (!directoryId) {
		setMessage({
			error: true,
			message: "Invalid directory!",
		});
		return;
	}

	try {
		const { data } = await axios.delete(
			`/directory/delete?directory=${directoryId.trim()}`,
			{
				headers: {
					Authorization: localStorage.getItem("token"),
				},
			}
		);

		if (data.success) {
			setMessage({
				error: false,
				message: "Directory deleted successfully",
			});
			setTimeout(() => {
				window.location.reload();
			}, 1000);
		}
	} catch (error) {
		setMessage({
			error: true,
			message: "Directory deleted successfully",
		});
	}
}

async function pin(directoryId, setMessage) {
	if (!directoryId) {
		setMessage({
			error: true,
			message: "Invalid directory!",
		});
		return;
	}

	try {
		const { data } = await axios.post(
			`/directory/pin?directory=${directoryId}`,
			{},
			{
				headers: {
					Authorization: localStorage.getItem("token"),
				},
			}
		);
		if (data.success) {
			setMessage({
				error: false,
				message: "Directory pinned successfully",
			});
			setTimeout(() => {
				window.location.reload();
			}, 1000);
		}
	} catch (error) {
		setMessage({
			error: true,
			message: "Failed to pin directory",
		});
	}
}

async function renameFolder(directoryId, directoryName, setMessage) {
	if (!directoryName || !directoryId) {
		setMessage({
			error: true,
			message: "Please enter a valid directory name",
		});
		return;
	}

	try {
		const { data } = await axios.patch(
			`/directory/rename?directory=${directoryId}&newDirectoryName=${directoryName}`,
			{},
			{
				headers: {
					Authorization: localStorage.getItem("token"),
				},
			}
		);

		if (data.success) {
			setMessage({
				error: false,
				message: "Directory renamed successfully",
			});

			setTimeout(() => {
				window.location.reload();
			}, 1000);
		}
	} catch (error) {
		setMessage({
			error: true,
			message: "Failed to rename directory",
		});
	}
}

export default function ActionsDirectory({
	setShowDirectoryActions,
	X,
	Y,
	setShowManageAccess,
	setShowMove,
}) {
	const { setMessage, directoryId } = useContext(DataContext);
	const [directoryName, setDirectoryName] = useState("");
	const [showShare, setShowShare] = useState(false);
	const actionsDirectoryRef = useRef();
	const shareList = useRef();

	useEffect(() => {
		if (actionsDirectoryRef.current) {
			actionsDirectoryRef.current.style.left = X + window.scrollX + "px";
			actionsDirectoryRef.current.style.top = Y + window.scrollY + "px";
		}
	}, []);

	return (
		<Fragment>
			{showShare && (
				<Share
					setShowShare={setShowShare}
					shareList={shareList}
					directoryId={directoryId}
					actionsDirectoryRef={actionsDirectoryRef}
				/>
			)}
			<ul
				ref={actionsDirectoryRef}
				className="actions"
				onMouseLeave={() => {
					if (!shareList.current) {
						setShowDirectoryActions(false);
					}
				}}
			>
				<li
					onClick={() => {
						setShowShare(true);
					}}
				>
					<img src={shareIcon} alt="share" />
					Share
					<img style={{ marginLeft: "auto" }} src={moreIcon} alt="more" />
				</li>

				<hr className="actions-hr" />
				<li onClick={() => pin(directoryId, setMessage)}>
					<img src={pinIcon} alt="pin" />
					Pin
				</li>
				<li>
					<img src={renameIcon} alt="rename" />
					<input
						onKeyDown={(e) => {
							if (e.key === "Enter") {
								renameFolder(
									directoryId,
									directoryName.trim().toLowerCase(),
									setMessage
								);
							}
						}}
						onChange={(e) =>
							setDirectoryName(e.target.value.trim().toLowerCase())
						}
						placeholder="Rename"
						id="rename-folder"
					/>
				</li>
				<hr className="actions-hr" />
				<li onClick={() => deleteDirectory(directoryId, setMessage)}>
					<img src={deleteIcon} alt="delete" />
					Delete
				</li>
				<hr className="actions-hr" />
				<li
					onClick={() => {
						setShowManageAccess(true);
					}}
				>
					<img src={manageAccessIcon} alt="access" />
					Manage Access
				</li>
				<li
					onClick={() => {
						setShowMove(true);
					}}
				>
					<img src={moveIcon} alt="access" />
					Move
				</li>
			</ul>
		</Fragment>
	);
}
