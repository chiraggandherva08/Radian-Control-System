import { Fragment, useContext, useEffect } from "react";
import axios from "axios";

import Tools from "../Tools/Tools";
import Content from "./Content";
import Message from "../Message/Message";
import Details from "../Details/Details";
import LoadingState from "./LoadingState";
import Player from "../Player/Player";
import { ProgressBar } from "../Tools/UploadFile";

import { DataContext } from "../../context/DataContext";

import "./style.css";
import SearchContextProvider from "../../context/SearchContext";
import Navigation from "../Tools/Navigation";

export default function Explorer() {
	const {
		sort,
		order,
		limit,
		page,
		message,
		setMessage,
		loading,
		setLoading,
		setTotalPages,
		setContent,
		viewDetails,
		uploadingFileProgress,
		previewUrl,
		setPreviewUrl,
	} = useContext(DataContext);

	useEffect(() => {
		async function fetchData() {
			const params = new URLSearchParams(window.location.search);
			const currentDirectoryId = params.get("directory");
			const shared = params.get("shared");
			let url = `/workspace/shared?sort=${sort}&limit=${limit}&page=${page}&order=${order}&directory=${currentDirectoryId}`;

			if (!shared || shared === "false") {
				url = url.replace("/shared", "");
			}

			try {
				setLoading(true);
				const { data } = await axios.get(url, {
					headers: {
						Authorization: localStorage.getItem("token"),
					},
				});

				if (data.success) {
					setTotalPages(data.data.pages);
					setContent((prev) => {
						return {
							...prev,
							containsFiles: data.data.files.length > 0,
							directories: data.data.directories,
							files: data.data.files,
							pages: data.data.pages,
						};
					});
				} else {
					setMessage({
						error: true,
						message: "Error occurred while fetching files and directories",
					});
				}
			} catch (error) {
				setMessage({
					error: true,
					message: "Error occurred while fetching files and directories",
				});
				console.error(error);
			} finally {
				setLoading(false);
			}
		}

		fetchData();
	}, [
		sort,
		order,
		limit,
		page,
		setMessage,
		setLoading,
		setContent,
		setTotalPages,
	]);

	return (
		<Fragment>
			<SearchContextProvider>
				<Tools />
			</SearchContextProvider>

			<Navigation />

			{previewUrl && <Player url={previewUrl} setUrl={setPreviewUrl} />}

			{message && <Message message={message} setMessage={setMessage} />}

			<div className={`table-container ${viewDetails ? "shrink" : ""}`}>
				{!loading && <Content />}

				{loading && <LoadingState />}

				{viewDetails && <Details />}
			</div>

			{uploadingFileProgress && <ProgressBar />}
		</Fragment>
	);
}
