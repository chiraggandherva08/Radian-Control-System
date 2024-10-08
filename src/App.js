import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import axios from "axios";

import Home from "./pages/Home/Home.js";
import Login from "./pages/Login/Login.js";
import ForgotPassword from "./pages/ForgotPassword/ForgotPassword.js";

import DataContext from "./context/DataContext.js";
import Logout from "./pages/Logout/logout.js";
import NotFound from "./pages/NotFound/NotFound.js";
import Users from "./pages/Users/Users.js";

axios.defaults.baseURL = process.env.REACT_APP_server_endpoint;
axios.defaults.withCredentials = true;
axios.defaults.headers.common["Authorization"] = localStorage.getItem("token");

function App() {
	return (
		<DataContext>
			<Router>
				<Routes>
					<Route path="/" element={<Home />} />
					<Route path="/home" element={<Home />} />
					<Route path="/users" element={<Users />} />
					<Route path="/login" element={<Login />} />
					<Route path="/logout" element={<Logout />} />
					<Route path="/forgot-password" element={<ForgotPassword />} />
					<Route path="*" element={<NotFound />} />
				</Routes>
			</Router>
		</DataContext>
	);
}

export default App;
