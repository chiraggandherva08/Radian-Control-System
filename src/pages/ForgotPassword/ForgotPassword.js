import "./style.css";
import React from "react";
import { useState } from "react";
import axios from "axios";
import petalStudioIcon from "../../assets/petalstudio.png";
import { Link } from "react-router-dom";

export default function ForgotPassword() {
	const [email, setEmail] = useState("");

	async function handleForgotPassword(e) {
		e.preventDefault();

		if (email === "" || !email) {
			return;
		}

		try {
			const { data } = await axios.post("/forgot-password", {
				email,
			});
		} catch (error) {
			console.error(error);
		}
	}

	return (
		<form id="forgot-password-form" onSubmit={(e) => handleForgotPassword(e)}>
			<Link to={"/"} id="login-logo">
				<img src={petalStudioIcon} alt="logo" />
				<span>RADIAN CONTROL SYSTEM</span>
			</Link>

			<h1>Forgot Password</h1>

			<input
				autoFocus
				type="email"
				placeholder="Email"
				onChange={(e) => setEmail(e.target.value)}
				required
			/>
			<div id="forgot-password">
				<Link to={"/login"}>Login?</Link>
			</div>
			<button>Get Link</button>
		</form>
	);
}
