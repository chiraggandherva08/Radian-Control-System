import React, { Fragment, useContext, useEffect, useState } from "react";

import Nav from "../../components/Nav/Nav";

import { DataContext } from "../../context/DataContext";

import "./style.css";
import axios from "axios";
import Message from "../../components/Message/Message";

export default function Users() {
	const [users, setUsers] = useState([]);
	const { message, setMessage } = useContext(DataContext);

	useEffect(() => {
		async function getUsers() {
			try {
				const { data } = await axios.get("/users", {
					headers: {
						Authorization: localStorage.getItem("token"),
					},
				});

				if (data.success) {
					setUsers(data.data.users);
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

		getUsers();
	}, []);

	return (
		<Fragment>
			{message && <Message message={message} setMessage={setMessage} />}

			<Nav />
			<div id="users">
				<h1>Users</h1>

				<ul>
					{users.map((user, index) => {
						return (
							<li key={index}>
								<span>
									<strong>{user.fullName}</strong>
								</span>
								<span style={{ fontSize: "13px" }}>{user.email}</span>
								<span style={{ fontSize: "13px" }}>{user.role}</span>
							</li>
						);
					})}
				</ul>
			</div>
		</Fragment>
	);
}
