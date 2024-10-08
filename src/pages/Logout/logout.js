import React, { useEffect } from "react";
import axios from "axios";

import "./style.css";

export default function Logout() {
	useEffect(() => {
		async function logout() {
			try {
				await axios.post(
					"/logout",
					{},
					{
						headers: {
							Authorization: localStorage.getItem("token"),
						},
					}
				);
				localStorage.removeItem("token");
				window.location.href = "/login";
			} catch (error) {
				console.error(error);
			}
		}

		logout();
	}, []);

	return (
		<div>
			<h1>Logout</h1>
		</div>
	);
}
