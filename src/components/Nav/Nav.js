import "./style.css";
import { Link } from "react-router-dom";

import petalStudioIcon from "../../assets/petalstudio.png";
import showIcon from "../../assets/show.svg";
import menuIcon from "../../assets/menu.svg";
import { useRef, useState } from "react";

function NavActions({ setShowActions, user }) {
	return (
		<ul className="nav-actions" onMouseLeave={() => setShowActions(false)}>
			<li>
				<Link to={`/profile/${user}`}>Your Profile</Link>
			</li>
			<li>
				<Link to="/logout">Logout</Link>
			</li>
		</ul>
	);
}

export default function Nav() {
	const navLinks = useRef();
	const user = localStorage.getItem("user");
	const [showActions, setShowActions] = useState(false);

	return (
		<nav id="nav">
			<img
				className="menu-icon"
				src={menuIcon}
				alt="menu"
				onClick={() => {
					navLinks.current.classList.toggle("toggle-menu");
				}}
			/>
			<ul id="nav-logo">
				<li>
					<Link
						style={{
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
							fontFamily: "Contrail One, sans-serif",
							fontWeight: 400,
							fontSize: "13px",
							fontStyle: "normal",
						}}
						to="/home"
					>
						<img
							style={{ width: "40px", marginRight: "15px" }}
							src={petalStudioIcon}
							alt="RADIAN CONTROL SYSTEM"
						/>
						RADIAN CONTROL SYSTEM
					</Link>
				</li>
			</ul>

			<ul className="nav-links" ref={navLinks}>
				<li>
					<a href="/home">Home</a>
				</li>
				<li>
					<a href="/home?shared=true">Shared</a>
				</li>
				<li>
					<Link to="/users">View Users</Link>
				</li>
				<li id="profile">
					{user ? <div id="avatar"> {user[0].toUpperCase()} </div> : null}
					{user ? (
						<div>{user.slice(0, 7)}...</div>
					) : (
						<Link to="/login">Login</Link>
					)}
					<img
						src={showIcon}
						className="nav-img"
						alt="Show profile"
						onClick={() => {
							setShowActions(!showActions);
						}}
					/>
				</li>

				{showActions && (
					<NavActions setShowActions={setShowActions} user={user} />
				)}
			</ul>
		</nav>
	);
}
