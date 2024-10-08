import { useState, useContext } from "react";
import axios from "axios";
import { DataContext } from "../../context/DataContext";

export default function CreateDirectory({ setCreateDirectory }) {
	const [visibility, setVisibility] = useState("private");
	const [directoryName, setDirectoryName] = useState(null);
	const [directoryDescription, setDirectoryDescription] = useState("");
	const { setMessage } = useContext(DataContext);

	async function createDirectory(e) {
		e.preventDefault();

		if (!directoryName || !visibility) {
			setMessage({
				error: true,
				message: "Please fill in all fields",
			});
			return;
		}

		const directoryId = new URLSearchParams(window.location.search).get(
			"directory"
		);

		try {
			const { data } = await axios.put(
				`/directory/create?directoryName=${directoryName}&description=${directoryDescription}&visibility=${visibility}` +
					(directoryId ? `&directory=${directoryId}` : ""),
				{},
				{
					headers: {
						Authorization: localStorage.getItem("token"),
					},
				}
			);

			if (data?.success) {
				setMessage({
					error: false,
					message: data.message,
				});
				setTimeout(() => {
					window.location.reload();
				}, 100);
			} else {
				setMessage({
					error: true,
					message: data.message,
				});
			}
		} catch (error) {
			setMessage({
				error: true,
				message: "Failed to create directory",
			});
		}
	}

	return (
		<div className="backdrop">
			<form
				id="create-directory"
				onSubmit={(e) => {
					createDirectory(e);
				}}
			>
				<input
					autoFocus
					onChange={(e) => {
						setDirectoryName(e.target.value.trim());
					}}
					type="text"
					placeholder="Enter directory name"
				/>

				<hr />

				<textarea
					onChange={(e) => {
						setDirectoryDescription(e.target.value.trim());
					}}
					placeholder="Enter directory description"
				></textarea>

				<hr />

				<div>
					<label>Visibility: </label>
					<select
						onChange={(e) => {
							setVisibility(e.target.value.trim());
						}}
						defaultValue={"internally-shared"}
					>
						<option value="internally-shared">Internally-Shared</option>
						<option value="private">Private</option>
					</select>
				</div>

				<hr />
				<div>
					<button
						style={{
							backgroundColor: "#446ab7",
							color: "white",
						}}
						type="submit"
						onClick={() => {
							setTimeout(() => {
								setCreateDirectory(false);
							}, 100);
						}}
					>
						Create
					</button>
					<button
						style={{ backgroundColor: "#e92424", color: "white" }}
						onClick={() => {
							setCreateDirectory(false);
						}}
					>
						Cancel
					</button>
				</div>
			</form>
		</div>
	);
}
