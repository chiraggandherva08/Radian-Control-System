import { createContext, useState } from "react";

export const UploadContext = createContext();

const UploadContextProvider = ({ children }) => {
	const [uploadingFileProgress, setUploadingFileProgress] = useState(null);
	return (
		<UploadContext.Provider
			value={{
				uploadingFileProgress,
				setUploadingFileProgress,
			}}
		>
			{children}
		</UploadContext.Provider>
	);
};

export default UploadContextProvider;
