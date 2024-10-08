import React, { useContext, useEffect, useState } from "react";
import "./style.css";

import crossIcon from "../../assets/cross.svg";
import { DataContext } from "../../context/DataContext";
import axios from "axios";

export default function ManageAccess({ setShowManageAccess }) {
	const [users, setUsers] = useState([]);
	const { setMessage, directoryId } = useContext(DataContext);
	const [revokeUsers, setRevokeUsers] = useState([]);
	const [editAccessUsers, setEditAccessUsers] = useState([]);

	async function saveChanges() {
		for (const user of editAccessUsers) {
			try {
				const { data } = await axios.patch(
					`workspace/edit-access?directory=${directoryId}&access=${user.access}&user=${user.userId}`,
					{},
					{
						headers: {
							Authorization: localStorage.getItem("token"),
						},
					}
				);

				if (!data.success) {
					setMessage({
						error: true,
						message: "Failed to update user!",
					});
				}
				setShowManageAccess(false);
			} catch (error) {
				setMessage({
					error: true,
					message: "Unable to save changes!",
				});
			}
		}

		for (const user of revokeUsers) {
			try {
				const { data } = await axios.delete(
					`workspace/revoke?directory=${directoryId}&user=${user}`,
					{},
					{
						headers: {
							Authorization: localStorage.getItem("token"),
						},
					}
				);

				if (!data.success) {
					setMessage({
						error: true,
						message: "Failed to remove user!",
					});
				}
				setShowManageAccess(false);
			} catch (error) {
				setMessage({
					error: true,
					message: "Unable to save changes!",
				});
			}
		}
	}

	useEffect(() => {
		async function getAccess() {
			try {
				const { data } = await axios.get(
					`directory/access?directory=${directoryId}`,
					{
						headers: {
							Authorization: localStorage.getItem("token"),
						},
					}
				);

				if (data.success) {
					setUsers(data.data.shared);
				} else {
					setMessage({
						error: true,
						message: "Unable to fetch users!",
					});
				}
			} catch (error) {
				setMessage({
					error: true,
					message: "Unable to fetch users!",
				});
			}
		}

		getAccess();
	}, []);
	return (
		<div className="backdrop">
			<div id="manage-access">
				<span
					style={{
						cursor: "pointer",
						color: "rgb(21, 43, 113)",
						marginBottom: "10px",
					}}
					onClick={() => setShowManageAccess(false)}
				>
					{"< cancel"}
				</span>
				{/* <img
					src={crossIcon}
					style={{ cursor: "pointer" }}
					alt="close filters"
					onClick={() => setShowManageAccess(false)}
				/> */}
				<h3>Manage Access</h3>

				<ul>
					{users.map((user, index) => {
						return (
							<li key={index}>
								<div>
									<strong>Email:</strong> {user.email}
								</div>
								<div>
									<strong>Role:</strong> {user.user.role}
								</div>

								<div>
									<select
										defaultValue={user.access}
										onChange={(e) => {
											e.target.classList.add("to-be-changed");
											setEditAccessUsers((prev) => {
												const uniqueUsers = prev.filter(
													(u) => u.userId !== user.user._id
												);

												uniqueUsers.push({
													userId: user.user._id,
													access: e.target.value,
												});

												return uniqueUsers;
											});
										}}
									>
										<option value="view">View</option>
										<option value="edit">Edit</option>
									</select>

									<button
										className="revoke-button"
										onClick={(e) => {
											e.target.classList.add("to-be-revoked");

											setEditAccessUsers((prev) => {
												const uniqueUsers = prev.filter(
													(u) => u.userId !== user.user._id
												);

												return uniqueUsers;
											});

											setRevokeUsers((prev) => {
												const uniqueUsers = prev.filter(
													(u) => u !== user.user._id
												);

												uniqueUsers.push(user.user._id);
												return uniqueUsers;
											});
										}}
									>
										Revoke User
									</button>
								</div>
							</li>
						);
					})}
				</ul>

				<button
					id="save-changes"
					onClick={() => {
						saveChanges();
					}}
				>
					Save Changes
				</button>
			</div>
		</div>
	);
}
