import { Fragment, useContext, useEffect, useRef, useState } from "react";
import "./style.css";
import axios from "axios";
import { DataContext } from "../../context/DataContext";

export default function Profile({ userId, X, Y, setShowProfile }) {
	const [user, setUser] = useState({
		fullName: "",
		email: "",
		role: "",
	});
	const profile = useRef();
	const { setMessage } = useContext(DataContext);

	useEffect(() => {
		if (profile.current) {
			profile.current.style.left = `${X - 20}px`;
			profile.current.style.top = `${Y + 10}px`;
		}

		async function fetchUser() {
			try {
				const { data } = await axios.get(`/users/${userId}`, {
					headers: {
						Authorization: localStorage.getItem("token"),
					},
				});

				if (data.success) {
					setUser(data.data.user);
				} else {
					setMessage({
						error: true,
						message: "Unable to load user!",
					});
				}
			} catch (error) {
				setMessage({
					error: true,
					message: "Unable to load user!",
				});
			}
		}

		fetchUser();
	}, []);

	return (
		<Fragment>
			<div
				ref={profile}
				className="profile"
				onMouseLeave={() => {
					setShowProfile(false);
				}}
			>
				<h3>Profile</h3>
				<p>
					<strong>Name:</strong> {user.fullName}
				</p>
				<p>
					<strong>Email:</strong> {user.email}
				</p>
				<p>
					<strong>Role:</strong> {user.role}
				</p>
			</div>
		</Fragment>
	);
}
