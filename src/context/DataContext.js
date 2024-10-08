import { createContext, useRef, useState } from "react";

export const DataContext = createContext();

const DataContextProvider = ({ children }) => {
	/*================= FILE & DIRECTORY ID =================*/
	const [directoryId, setDirectoryId] = useState(null);
	const [selectedFile, setSelectedFile] = useState(null);
	const [selectedFiles, setSelectedFiles] = useState([]);
	const [selectedDirectories, setSelectedDirectories] = useState([]);

	/*================= PAGINATION & SORTING =================*/
	const [sort, setSort] = useState(
		localStorage.getItem("sorting") || "directory"
	);
	const [order, setOrder] = useState(
		localStorage.getItem("sorting_order") || 1
	);
	const [limit, setLimit] = useState(localStorage.getItem("limit") || 10);
	const [page, setPage] = useState(1);
	const [totalPages, setTotalPages] = useState(null);

	/*================= FILE & DIRECTORY ID =================*/
	const [loading, setLoading] = useState(false);
	const [message, setMessage] = useState(null);

	/*================= UPLOAD FILE =================*/
	const [uploadingFileProgress, setUploadingFileProgress] = useState(null);

	/*================= DETAILS =================*/

	const [viewDetails, setViewDetails] = useState(false);

	/*================= MAIN CONTENT =================*/
	const [content, setContent] = useState({
		containsFiles: false,
		directories: [],
		files: [],
		pages: 1,
	});

	const [previewUrl, setPreviewUrl] = useState(null);

	const [viewFileActions, setViewFileActions] = useState(false);
	const [viewDirectoryActions, setViewDirectoryActions] = useState(false);
	const actionPosition = useRef({ X: 0, Y: 0 });

	return (
		<DataContext.Provider
			value={{
				sort,
				setSort,
				order,
				setOrder,
				limit,
				setLimit,
				page,
				setPage,
				loading,
				setLoading,
				totalPages,
				setTotalPages,
				message,
				setMessage,
				content,
				setContent,
				viewDetails,
				setViewDetails,
				directoryId,
				setDirectoryId,
				selectedFile,
				setSelectedFile,
				uploadingFileProgress,
				setUploadingFileProgress,
				viewFileActions,
				setViewFileActions,
				viewDirectoryActions,
				setViewDirectoryActions,
				actionPosition,
				selectedFiles,
				setSelectedFiles,
				selectedDirectories,
				setSelectedDirectories,
				previewUrl,
				setPreviewUrl,
			}}
		>
			{children}
		</DataContext.Provider>
	);
};

export default DataContextProvider;
