import { Fragment, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import Explorer from "../../components/Explorer/Explorer";
import Nav from "../../components/Nav/Nav";

export default function Home() {
	const navigate = useNavigate();

	useEffect(() => {
		const token = localStorage.getItem("token");
		if (!token) {
			navigate("/login");
		}
	}, []);

	return (
		<Fragment>
			<Nav />
			<Explorer />
		</Fragment>
	);
}
