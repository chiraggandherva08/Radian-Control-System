import { useEffect, useRef, useState } from "react";
import shareIcon from "../../assets/share.svg";
import searchIcon from "../../assets/search-share.svg";
import axios from "axios";

export default function Share({
	directoryId,
	actionsDirectoryRef,
	shareList,
	setShowShare,
}) {
	const [searchUsersInput, setSearchUsersInput] = useState("");
	const [users, setUsers] = useState([]);
	const shareListInput = useRef();

	async function share(directoryId, recipientUser, access) {
		try {
			const { data } = await axios.post(
				`/workspace/share?directory=${directoryId}&user=${recipientUser}&access=${"edit"}`,
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
		const boundingRect = actionsDirectoryRef.current?.getBoundingClientRect();
		if (boundingRect) {
			let top = boundingRect.top + window.scrollY;
			let left = boundingRect.left + window.scrollX;

			if (left + 200 > window.innerWidth) left = window.innerWidth - 300;
			if (top + 200 > window.innerHeight) top = window.innerHeight - 300;

			shareList.current.style.left = `${left - 240}px`;
			shareList.current.style.top = `${top}px`;
		}

		async function searchUsers() {
			const q = searchUsersInput.trim().toLowerCase();
			if (q.length === 0) {
				setUsers([]);
				return;
			}

			try {
				const { data } = await axios.get(`/search-users?q=${q}`, {
					headers: {
						Authorization: localStorage.getItem("token"),
					},
				});
				if (data.success) {
					setUsers(data.data.users);
				}
			} catch (error) {
				console.error(error);
			}
		}

		searchUsers();
	}, [searchUsersInput]);

	return (
		<ul
			ref={shareList}
			className="share-list"
			onMouseLeave={() => {
				setSearchUsersInput("");
				setUsers([]);
				shareListInput.current.value = "";
				setShowShare(false);
			}}
		>
			<li id="search-users">
				<img src={searchIcon} alt="search" />
				<input
					autoFocus={true}
					ref={shareListInput}
					placeholder="Search"
					onChange={(e) => {
						setSearchUsersInput(e.target.value);
					}}
				/>
			</li>
			{users.map((user, index) => {
				if (user.email === localStorage.getItem("user")) {
					return (
						<li
							className="faded"
							key={index}
							style={{
								cursor: "not-allowed",
								fontSize: "13px",
							}}
						>
							{user.email} (You)
						</li>
					);
				}
				return (
					<li
						key={index}
						style={{ fontSize: "13px" }}
						onClick={() => share(directoryId, user._id)}
					>
						{user.email}
						<img src={shareIcon} alt="Share" />
					</li>
				);
			})}
		</ul>
	);
}
