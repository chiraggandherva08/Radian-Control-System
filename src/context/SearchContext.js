import { createContext, useState } from "react";

export const SearchContext = createContext();

const SearchContextProvider = ({ children }) => {
	/*================= SEARCH RESULTS =================*/
	const [searchQuery, setSearchQuery] = useState("");
	const [searchResults, setSearchResults] = useState({
		files: [],
		directories: [],
	});

	return (
		<SearchContext.Provider
			value={{
				searchQuery,
				setSearchQuery,
				searchResults,
				setSearchResults,
			}}
		>
			{children}
		</SearchContext.Provider>
	);
};

export default SearchContextProvider;
