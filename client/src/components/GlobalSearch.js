import React, { useEffect, useState } from "react";
import { Context } from "../globalContext";
import { withRouter } from "react-router-dom";
import SelectSearch from "react-select-search";
import AsyncSelect from "react-select/async";
import _ from "lodash";

import { searchWithCancel } from "../utils";

const GlobalSearch = () => {
	const global = React.useContext(Context);
	const [query, setQuery] = useState("");
	const [selection, setSelection] = useState({});

	const CustomOption = (props) =>
		!props.isDisabled || props.data.cover ? (
			<div
				className="flex justify-between my-1 items-center"
				{...props.innerProps}
			>
				{console.log(props)}
				{props.data.label}
				<img className="h-16" src={props.data.cover}></img>
			</div>
		) : null;

	const search = async (query) => {
		return new Promise((resolve, reject) => {
			searchWithCancel(`/api/gcpbooks/query/${query}`)
				.then((response) => {
					if (response) {
						resolve(
							response?.map((book) => ({
								value: book.volumeInfo.industryIdentifiers?.find(
									(object) => object.type === "ISBN_13"
								)?.identifier,
								label: book.volumeInfo.title,
								cover: book.volumeInfo.imageLinks.thumbnail,
							}))
						);
					}
				})
				.catch((e) => {
					console.error(e);
					reject(`Error: ${e}`);
				});
		});
	};

	useEffect(() => {
		console.log(selection);
	}, [selection]);

	const customStyles = {
		option: (provided, state) => ({
			...provided,
			cursor: "pointer",
		}),
		control: () => ({
			// none of react-select's styles are passed to <Control />
			cursor: "pointer",
			alignItems: "center",
			backgroundColor: "white",
			borderColor: "hsl(0,0%,80%)",
			borderRadius: "4px",
			borderStyle: "solid",
			borderWidth: "1px",
			flexWrap: "wrap",
			justifyContent: "space-between",
			minHeight: "38px",
			outline: "0",
			position: "relative",
			transition: "all 100ms",
			boxSizing: "border-box",
			display: "flex",
		}),
	};

	return (
		<>
			<div style={{ width: "18rem" }}>
				{/* <SelectSearch
				options={[]}
				getOptions={(query) => search(query)}
				search
				placeholder="Your favorite drink"
			/> */}
				<AsyncSelect
					components={{
						DropdownIndicator: () => null,
						IndicatorSeparator: () => null,
						Option: CustomOption,
					}}
					styles={customStyles}
					cacheOptions
					loadOptions={search}
					onInputChange={(value) => setQuery(value)}
					onChange={(value) => setSelection(value)}
				/>
				{/* <input
				className="w-full h-12 p-2 border-2 rounded"
				key={`global-nav-search`}
				type="search"
				placeholder={`Search...`}
				value={global.searchValue}
				onChange={(event) => console.log(event)}
			/> */}
			</div>
		</>
	);
};

export default withRouter(GlobalSearch);
