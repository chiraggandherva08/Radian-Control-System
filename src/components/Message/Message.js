import closeIcon from "../../assets/cross.svg";
import "./style.css";

export default function Message({ message, setMessage }) {
	return (
		<div
			id="message"
			style={{ background: message.error ? "#dc5050" : "#67b485" }}
		>
			<div>
				<p style={{ textDecoration: "underline", fontSize: "1.2em" }}>Message</p>
				<p>{message.message}</p>
			</div>
			<div>
				<img
					id="message-close"
					src={closeIcon}
					alt="Close Message"
					onClick={() => setMessage(null)}
				/>
			</div>
		</div>
	);
}
