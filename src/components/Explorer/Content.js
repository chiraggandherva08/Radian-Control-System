import { Fragment, useContext, useRef, useState } from "react";

import directoryIcon from "../../assets/directory.svg";
import actionIcon from "../../assets/action.svg";
import fileIcon from "../../assets/file.svg";

import ActionsFile from "../Actions/ActionsFile";
import ActionsDirectory from "../Actions/ActionsDirectory";
import Pagination from "../Tools/Pagination";

import { DataContext } from "../../context/DataContext";

import "./style.css";
import Profile from "../profile/Profile";
import ManageAccess from "../ManageAccess/ManageAccess";
import Move from "../Move/Move";

export default function Content() {
	const filesColumns = useRef([
		"Select",
		"Name",
		"Creator",
		"Created At",
		"Actions",
	]);
	const dirColumns = useRef([
		"Select",
		"Name",
		"Creator",
		"Shared",
		"Created At",
		"Actions",
	]);

	const profileLocation = useRef(null);

	const {
		content,
		setViewDetails,
		setDirectoryId,
		setSelectedFile,
		selectedFiles,
		setSelectedFiles,
		setPreviewUrl,
		selectedDirectories,
		setMessage,
		setSelectedDirectories,
		actionPosition,
	} = useContext(DataContext);
	const { directories, files } = content;
	const [showDirectoryActions, setShowDirectoryActions] = useState(false);
	const [showManageAccess, setShowManageAccess] = useState(false);
	const [showFileActions, setShowFileActions] = useState(false);
	const [showProfile, setShowProfile] = useState(false);
	const userId = useRef(null);
	const [showMove, setShowMove] = useState(false);

	return (
		<Fragment>
			{showManageAccess && (
				<ManageAccess setShowManageAccess={setShowManageAccess} />
			)}
			{showMove && <Move setShowMove={setShowMove} />}
			{showDirectoryActions && (
				<ActionsDirectory
					X={actionPosition.current.X}
					Y={actionPosition.current.Y}
					setShowManageAccess={setShowManageAccess}
					setShowMove={setShowMove}
					setShowDirectoryActions={setShowDirectoryActions}
				/>
			)}
			{showFileActions && (
				<ActionsFile
					X={actionPosition.current.X}
					Y={actionPosition.current.Y}
					setShowMove={setShowMove}
					setShowFileActions={setShowFileActions}
				/>
			)}

			{showProfile && (
				<Profile
					userId={userId.current}
					X={profileLocation.current.X}
					Y={profileLocation.current.Y}
					setShowProfile={setShowProfile}
				/>
			)}

			{/* ======================= NOTHING TO SHOW ======================= */}
			{directories.length === 0 && files.length === 0 && (
				<div className="nothing-to-show">
					<p>Nothing to show here</p>
				</div>
			)}
			{/* ======================= DIRECTORY EXP ======================= */}
			{directories.length > 0 && (
				<Fragment>
					<Pagination title={"Directory"} />
					<table className="explorer directories">
						<thead>
							<tr>
								{dirColumns.current.map((column, index) => {
									let width =
										index === dirColumns.current.length - 1 ? "auto" : "100px";
									if (index === 0) {
										width = "10px";
									}

									return (
										<th
											className={`${
												index !== 0 &&
												index !== 1 &&
												index !== dirColumns.current.length - 1
													? "hide-on-mobile"
													: ""
											}`}
											key={index}
											style={{
												width: width,
												textAlign:
													index === dirColumns.current.length - 1
														? "right"
														: "left",
											}}
										>
											{index === 0 ? (
												<input
													style={{ cursor: "pointer" }}
													type="checkbox"
													onClick={(e) => {
														e.target.checked
															? setSelectedDirectories(
																	directories.map((dir) => dir._id)
															  )
															: setSelectedDirectories([]);
													}}
												/>
											) : (
												column
											)}
										</th>
									);
								})}
							</tr>
						</thead>

						<tbody>
							{directories.map((directory) => {
								return (
									<tr
										className={`${
											selectedDirectories.includes(directory._id)
												? "selected-item"
												: ""
										}`}
										key={directory._id}
										onClick={() => {
											if (
												selectedDirectories.length > 0 ||
												selectedFiles.length > 0
											) {
												if (selectedDirectories.includes(directory._id)) {
													setSelectedDirectories(
														selectedDirectories.filter(
															(id) => id !== directory._id
														)
													);
												} else {
													setSelectedDirectories((prev) => {
														return [...prev, directory._id];
													});
												}
											}
										}}
									>
										<td>
											<input
												type="checkbox"
												style={{ cursor: "pointer" }}
												onChange={(e) => {
													if (e.target.checked) {
														setSelectedDirectories((prev) => {
															return [...prev, directory._id];
														});
													} else {
														const newSelected = selectedDirectories.filter(
															(id) => id !== directory._id
														);
														setSelectedDirectories(newSelected);
													}
												}}
												checked={selectedDirectories.includes(directory._id)}
											/>
										</td>
										<td
											style={{
												width: "200px",
												cursor: "pointer",
												display: "flex",
												alignItems: "center",
											}}
											onDoubleClick={() => {
												window.location.href = `/home?directory=${directory._id}`;
											}}
											onClick={() => {
												setDirectoryId(directory._id);
												setSelectedFile(null);
												setViewDetails(true);
											}}
										>
											<img src={directoryIcon} alt="Directory" />
											{directory.directoryName.length < 10
												? directory.directoryName
												: directory.directoryName.slice(0, 10) + "..."}
										</td>
										<td className="hide-on-mobile">{directory.creatorEmail}</td>
										<td className="hide-on-mobile">
											<div
												style={{
													display: "flex",
													justifyContent: "flex-start",
													alignItems: "center",
												}}
											>
												{directory?.shared.length === 0
													? "-"
													: directory.shared.slice(0, 3).map((user, index) => {
															const bg = ["#1CDC52", "#1C93DC", "#DCA61C"];
															const style = {
																borderRadius: "50%",
																width: "25px",
																height: "25px",
																display: "flex",
																justifyContent: "center",
																alignItems: "center",
																background: bg[index],
																color: "white",
																transform: `translateX(-${index * 10}px)`,
																cursor: "pointer",
															};
															return (
																<div
																	key={index}
																	style={style}
																	onClick={(e) => {
																		profileLocation.current = {
																			X: e.clientX,
																			Y: e.clientY,
																		};
																		userId.current = user.user;
																		setShowProfile((prev) => !prev);
																	}}
																>
																	{user.email[0].toUpperCase()}
																</div>
															);
													  })}
											</div>
										</td>
										<td
											className="hide-on-mobile"
											style={{
												color: "#616161",
											}}
										>
											{new Date(directory.createdAt).toLocaleDateString()}
										</td>
										<td>
											<img
												style={{
													marginLeft: "calc(100% - 20px)",
													marginTop: "10px",
												}}
												onClick={(e) => {
													actionPosition.current = {
														X: e.clientX - 240,
														Y: e.clientY + 20,
													};
													setShowDirectoryActions(true);
													setDirectoryId(directory._id);
												}}
												src={actionIcon}
												className="actions-icon"
												alt="action icon"
											/>
										</td>
									</tr>
								);
							})}
						</tbody>
					</table>
				</Fragment>
			)}

			{/* ======================= FILE EXP ======================= */}
			{files.length > 0 && (
				<Fragment>
					<Pagination title={"Files"} />
					<table className="explorer files">
						<thead>
							<tr>
								{filesColumns.current.map((column, index) => {
									let width =
										index === filesColumns.current.length - 1
											? "auto"
											: "100px";
									if (index === 0) {
										width = "10px";
									}

									return (
										<th
											className={`${
												index !== 0 &&
												index !== 1 &&
												index !== filesColumns.current.length - 1
													? "hide-on-mobile"
													: ""
											}`}
											key={index}
											style={{
												width: width,

												textAlign:
													index === filesColumns.current.length - 1
														? "right"
														: "left",
											}}
										>
											{index === 0 ? (
												<input
													style={{ cursor: "pointer" }}
													type="checkbox"
													onClick={(e) => {
														setSelectedFiles(
															e.target.checked
																? files.map((file) => file._id)
																: []
														);
													}}
												/>
											) : (
												column
											)}
										</th>
									);
								})}
							</tr>
						</thead>
						<tbody>
							{files.map((file) => {
								const splitted = file.fileName.split(".");
								const displayName =
									file.fileName.length < 10
										? file.fileName
										: `${splitted[0].slice(0, 10)}...${
												splitted[splitted.length - 1]
										  }`;

								return (
									<tr
										onDoubleClick={() => {
											if (file.ACL === "public-read") {
												setPreviewUrl({
													contentType: file.contentType,
													url: file.url,
												});
											} else {
												setPreviewUrl(null);
												setMessage({
													error: true,
													message: "Cannot preview private files",
												});
											}
										}}
										key={file._id}
										className={`${
											selectedFiles.includes(file._id) ? "selected-item" : ""
										}`}
										onClick={() => {
											if (
												selectedDirectories.length > 0 ||
												selectedFiles.length > 0
											) {
												if (selectedFiles.includes(file._id)) {
													setSelectedFiles(
														selectedFiles.filter((id) => id !== file._id)
													);
												} else {
													setSelectedFiles((prev) => {
														return [...prev, file._id];
													});
												}
											}
										}}
									>
										<td>
											<input
												type="checkbox"
												style={{ cursor: "pointer" }}
												onChange={(e) => {
													if (e.target.checked) {
														setSelectedFiles((prev) => {
															return [...prev, file._id];
														});
													} else {
														const newSelected = selectedFiles.filter(
															(id) => id !== file._id
														);
														setSelectedFiles(newSelected);
													}
												}}
												checked={selectedFiles.includes(file._id)}
											/>
										</td>
										<td
											style={{
												width: "200px",
												cursor: "pointer",
												display: "flex",
												alignItems: "center",
											}}
											onClick={() => {
												setSelectedFile(file);
												setDirectoryId(null);
											}}
										>
											<img src={fileIcon} alt="Directory" />
											{displayName}
										</td>
										<td className="hide-on-mobile">{file.creatorEmail}</td>
										<td
											className="hide-on-mobile"
											style={{
												color: "#616161",
											}}
										>
											{new Date(file.createdAt).toLocaleDateString()}
										</td>
										<td>
											<img
												style={{
													marginLeft: "calc(100% - 20px)",
													marginTop: "10px",
												}}
												onClick={(e) => {
													actionPosition.current = {
														X: e.clientX - 240,
														Y: e.clientY + 20,
													};
													setSelectedFile(file);
													setDirectoryId(null);
													setShowFileActions(true);
												}}
												src={actionIcon}
												className="actions-icon"
												alt="action icon"
											/>
										</td>
									</tr>
								);
							})}
						</tbody>
					</table>
				</Fragment>
			)}
		</Fragment>
	);
}
