import React from "react";
import "./style.css";
import { Link } from "react-router-dom";

export default function NotFound() {
	return (
		<div id="not-found">
			<h1>Page Not Found</h1>
			<ul>
            <li><strong>Steps</strong></li>
				<li>1. Check the URL</li>
				<li>2. Check the network connection</li>
				<li>3. Check the server</li>

				<li>
					<Link to={"/"}>Home</Link>
					<Link to={"/login"}>Login</Link>
				</li>
			</ul>
		</div>
	);
}
