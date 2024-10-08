import "./style.css";
import React from "react";
import { useState } from "react";
import axios from "axios";
import petalStudioIcon from "../../assets/petalstudio.png";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const navigate = useNavigate();

	async function handleLogin(e) {
		e.preventDefault();

		try {
			const { data } = await axios.post("/login", {
				email,
				password,
			});

			if (data?.success) {
				localStorage.setItem("token", data?.data.token);
				localStorage.setItem("user", data?.data.user);
				navigate("/home");
			}
		} catch (error) {
			console.error(error);
		}
	}

	return (
		<form id="login-form" onSubmit={(e) => handleLogin(e)}>
			<Link to={"/"} id="login-logo">
				<img src={petalStudioIcon} alt="logo" />
				<span>RADIAN CONTROL SYSTEM</span>
			</Link>

			<h1>Sign in</h1>

			<input
				autoFocus
				type="email"
				placeholder="Email"
				onChange={(e) => setEmail(e.target.value)}
				required
			/>
			<input
				type="password"
				placeholder="Password"
				onChange={(e) => setPassword(e.target.value)}
				required
			/>
			<div id="forgot-password">
				<Link to={"/forgot-password"}>Forgot Password?</Link>
			</div>
			<button>Login</button>
		</form>
	);
}
