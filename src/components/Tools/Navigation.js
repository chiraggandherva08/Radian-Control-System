import { Fragment, useContext, useEffect, useState } from "react";
import axios from "axios";
import { DataContext } from "../../context/DataContext";

export default function Navigation() {
	const [path, setPath] = useState(null);
	const { setMessage } = useContext(DataContext);

	useEffect(() => {
		async function fetchDetails() {
			try {
				const directoryId = new URLSearchParams(window.location.search).get(
					"directory"
				);
				if (!directoryId) {
					return;
				}
				const { data } = await axios.get(
					`/directory/details?directory=${directoryId}`
				);

				if (data.success) {
					setPath(data.data.directory.hierarchy);
				} else {
					setMessage({
						error: true,
						message: "Error occurred",
					});
				}
			} catch (error) {
				setMessage({
					error: true,
					message: "Error occurred",
				});
			}
		}

		fetchDetails();
	}, []);

	return (
		<Fragment>
			{path && (
				<ul id="navigation">
					{path?.map((hierarchy, index) => {
						return (
							<Fragment key={index}>
								<li
									className="navigation-link"
									onClick={() => {
										window.location.href = `/home?directory=${hierarchy._id}`;
									}}
								>
									{hierarchy.directoryName}
								</li>

								<li>{" > "}</li>
							</Fragment>
						);
					})}
				</ul>
			)}
		</Fragment>
	);
}
