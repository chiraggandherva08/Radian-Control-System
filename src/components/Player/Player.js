import ReactPlayer from "react-player/lazy";

import closeIcon from "../../assets/cross.svg";

import "./styles.css";

export default function Player({ url, setUrl }) {
	return (
		<div className="player-container">
			<img
				id="preview-close-icon"
				src={closeIcon}
				alt="close"
				onClick={() => {
					setUrl(null);
				}}
			/>
			{(url.contentType === "image/jpeg" ||
				url.contentType === "image/png" ||
				url.contentType === "image/gif" ||
				url.contentType === "image/svg+xml") && (
				<img id="preview-image" src={url.url} alt="preview" />
			)}
			{(url.contentType === "video/quicktime" ||
				url.contentType === "video/mp4" ||
				url.contentType === "video/mov") && (
				<ReactPlayer url={url.url} controls={true} volume={1} />
			)}
		</div>
	);
}
