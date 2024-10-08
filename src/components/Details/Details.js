import "./styles.css";
import crossIcon from "../../assets/cross.svg";
import { useContext, useEffect, useState } from "react";
import { DataContext } from "../../context/DataContext";
import axios from "axios";

export default function Details() {
	const { setViewDetails, directoryId, setMessage } = useContext(DataContext);
	const [details, setDetails] = useState(null);

	useEffect(() => {
		async function fetchDetails() {
			try {
				const { data } = await axios.get(
					`/directory/details?directory=${directoryId}`,
					{
						headers: {
							Authorization: localStorage.getItem("token"),
						},
					}
				);

				if (data.success) {
					setDetails(data.data.directory);
				} else {
					setMessage({
						error: true,
						message: "Error occurred while fetching details",
					});
				}
			} catch (error) {
				setMessage({
					error: true,
					message: "Error occurred while fetching details",
				});
			}
		}

		fetchDetails();
	}, [directoryId]);

	return (
		<div className="details">
			<img
				id="close-details"
				src={crossIcon}
				alt="cross"
				onClick={() => {
					setViewDetails(false);
				}}
			/>
			<p
				style={{
					fontSize: "20px",
					fontWeight: "700",
					marginLeft: "10px",
				}}
			>
				{details?.directoryName.length > 10
					? details?.directoryName.slice(0, 10).toUpperCase() + "..."
					: details?.directoryName.toUpperCase()}
			</p>
			<div id="toggle-details-activity"></div>
			<div id="details">
				<div className="detail-heading">Creator</div>
				<div className="detail-info">{details?.creatorEmail}</div>

				<div className="detail-heading">Created At</div>
				<div className="detail-info">
					{new Date(details?.createdAt).toLocaleDateString()}
				</div>

				<div className="detail-heading">Last Updated At</div>
				<div className="detail-info">
					{new Date(details?.updatedAt).toLocaleDateString()}
				</div>

				<div className="detail-heading">Shared With</div>
				{details?.shared.length === 0 ? (
					<div className="detail-info">Not Shared</div>
				) : (
					details?.shared.map((user) => {
						return (
							<div
								style={{
									marginTop: "5px",
									fontWeight: "300",
									display: "flex",
									justifyContent: "space-between",
								}}
								key={user._id}
							>
								<div>{user.email}</div>
								<div>{user.access}</div>
							</div>
						);
					})
				)}
				<div className="detail-heading">Items</div>
				<div className="detail-info">{details?.items}</div>
				<div className="detail-heading">Size</div>
				<div className="detail-info">{details?.size.toFixed(2)} Kb</div>

				<div className="detail-heading">Description</div>
				<div className="detail-info">{details?.description}</div>
			</div>
			<div id="activity"></div>
		</div>
	);
}
