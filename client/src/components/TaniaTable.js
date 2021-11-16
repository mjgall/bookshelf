import React, {
	useState,
	useMemo,
	useEffect,
	useContext,
	useCallback,
} from "react";
import { withRouter } from "react-router-dom";
import Select from "react-select";
import { Context } from "../globalContext";
import _ from "lodash";

const Pagination = ({
	activePage,
	count,
	rowsPerPage,
	totalPages,
	setActivePage,
}) => {
	const beginning = activePage === 1 ? 1 : rowsPerPage * (activePage - 1) + 1;
	const end = activePage === totalPages ? count : beginning + rowsPerPage - 1;

	return (
		<>
			<div className="pagination">
				<button
					disabled={activePage === 1}
					onClick={() => setActivePage(1)}
				>
					⏮️ First
				</button>
				<button
					disabled={activePage === 1}
					onClick={() => setActivePage(activePage - 1)}
				>
					⬅️ Previous
				</button>
				<button
					disabled={activePage === totalPages}
					onClick={() => setActivePage(activePage + 1)}
				>
					Next ➡️
				</button>
				<button
					disabled={activePage === totalPages}
					onClick={() => setActivePage(totalPages)}
				>
					Last ⏭️
				</button>
			</div>
			<p>
				Page {activePage} of {totalPages}
			</p>
			<p>
				Rows: {beginning === end ? end : `${beginning} - ${end}`} of{" "}
				{count}
			</p>
		</>
	);
};

const isEmpty = (obj = {}) => {
	return Object.keys(obj).length === 0;
};

const isString = (value) => {
	return typeof value === "string" || value instanceof String;
};

const isNumber = (value) => {
	return typeof value == "number" && !isNaN(value);
};

const isBoolean = (value) => {
	return value === true || value === false;
};

const isNil = (value) => {
	return typeof value === "undefined" || value === null;
};

const isDateString = (value) => {
	if (!isString(value)) return false;

	return value.match(/^\d{2}-\d{2}-\d{4}$/);
};

const convertDateString = (value) => {
	return value.substr(6, 4) + value.substr(3, 2) + value.substr(0, 2);
};

const toLower = (value) => {
	if (isString(value)) {
		return value.toLowerCase();
	}
	return value;
};

const convertType = (value) => {
	if (isNumber(value)) {
		return value.toString();
	}

	if (isDateString(value)) {
		return convertDateString(value);
	}

	if (isBoolean(value)) {
		return value ? "1" : "-1";
	}

	return value;
};

const filterRows = (rows, filters, currentUserId) => {
	console.log({ rows, filters });
	if (isEmpty(filters)) return rows;
	let results;
	if (filters.global) {
		const authorTitleStringRows = rows.map((row) => {
			return {
				...row,
				authorTitleString: row.author.concat(" ", row.title),
			};
		});
		results = authorTitleStringRows.filter((row) => {
			return Object.keys(filters).every(() => {
				const value = row.authorTitleString;
				const searchValue = filters.global;

				if (isString(value)) {
					return toLower(value).includes(toLower(searchValue));
				}

				if (isBoolean(value)) {
					return (
						(searchValue === "true" && value) ||
						(searchValue === "false" && !value)
					);
				}

				if (isNumber(value)) {
					return value == searchValue;
				}

				return false;
			});
		});
	} else if (filters.title || filters.author) {
		results = rows.filter((row) => {
			return Object.keys(filters).every((accessor) => {
				const value = row[accessor];
				const searchValue = filters[accessor];

				if (isString(value)) {
					return toLower(value).includes(toLower(searchValue));
				}

				if (isBoolean(value)) {
					return (
						(searchValue === "true" && value) ||
						(searchValue === "false" && !value)
					);
				}

				if (isNumber(value)) {
					return value == searchValue;
				}

				return false;
			});
		});
	} else {
		results = rows;
		console.log({ results });
	}

	let filterBooksByHouseholdOwner = (books, householdSelect, ownerSelect) => {
		let filteredBooks;
		console.log({ books, householdSelect, ownerSelect });
		// if (viewPrivate) {
		// 	filteredBooks = books.filter((book) => book.private === 1);
		// }
		// else
		if (householdSelect?.value == null || !ownerSelect) {
			filteredBooks = books;
		} else if (householdSelect.value === "none") {
			filteredBooks = books.filter(
				(book) => Number(book.user_id) === currentUserId
			);
		} else if (
			householdSelect?.value === "all" &&
			ownerSelect?.value === "all"
		) {
			return (filteredBooks = books);
		} else {
			const newBooks = books.filter((book) => {
				if (ownerSelect?.value === "all") {
					return (
						Number(book.household_id) ===
							Number(householdSelect.value) ||
						book.household_id === null
					);
				} else {
					return book.user_id === Number(ownerSelect?.value);
				}
			});
			filteredBooks = newBooks;
		}

		// if (viewRead) {
		// 	filteredBooks = filteredBooks.filter((book) => book.read === 1);
		// }

		return filteredBooks;
	};

	return filterBooksByHouseholdOwner(
		results,
		filters.householdSelect,
		filters.owner
	);
};

const sortRows = (rows, sort) => {
	return rows.sort((a, b) => {
		const { order, orderBy } = sort;

		if (isNil(a[orderBy])) return 1;
		if (isNil(b[orderBy])) return -1;

		const aLocale = convertType(a[orderBy]);
		const bLocale = convertType(b[orderBy]);

		if (order === "asc") {
			return aLocale.localeCompare(bLocale, "en", {
				numeric: isNumber(b[orderBy]),
			});
		} else {
			return bLocale.localeCompare(aLocale, "en", {
				numeric: isNumber(a[orderBy]),
			});
		}
	});
};

const paginateRows = (sortedRows, activePage, rowsPerPage) => {
	return [...sortedRows].slice(
		(activePage - 1) * rowsPerPage,
		activePage * rowsPerPage
	);
};

const Table = ({ columns, rows, history }) => {
	const getSavedHouseholdSelect = () => {
		const localSaved = JSON.parse(localStorage.getItem("householdFilter"));
		if (localSaved) {
			return localSaved;
		} else {
			return {
				value: "none",
				label: "Select household...",
			};
		}
	};

	const getSavedOwnerSelect = () => {
		const localSaved = JSON.parse(localStorage.getItem("ownerFilter"));
		if (localSaved) {
			return localSaved;
		} else {
			return {
				value: "all",
				label: "All members",
			};
		}
	};

	const global = useContext(Context);

	const [activePage, setActivePage] = useState(1);
	const [filters, setFilters] = useState({});
	const [sort, setSort] = useState({ order: "asc", orderBy: "id" });
	const [householdOptions, setHouseholdOptions] = useState([]);
	const [householdSelect, setHouseholdSelect] = useState(
		getSavedHouseholdSelect()
	);
	const [ownerSelect, setOwnerSelect] = useState(getSavedOwnerSelect());
	const [owners, setOwners] = useState([]);
	const [viewPrivate, setViewPrivate] = useState(false);
	const rowsPerPage = 25;

	const filteredRows = useMemo(
		() => filterRows(rows, filters, global.currentUser.id),
		[rows, filters, global.currentUser.id]
	);
	const sortedRows = useMemo(
		() => sortRows(filteredRows, sort),
		[filteredRows, sort]
	);
	const calculatedRows = paginateRows(sortedRows, activePage, rowsPerPage);

	const count = filteredRows.length;
	const totalPages = Math.ceil(count / rowsPerPage);

	const handleHouseholdChange = useCallback(
		(selected) => {
			getOwners(global.householdMembers, selected.value);
			setHouseholdSelect(selected);
			setOwnerSelect({ label: "All members", value: "all" });
			setFilters((prevFilters) => ({
				...prevFilters,
				householdSelect: selected,
				owner: { value: "all", label: "All members" },
			}));
			localStorage.setItem("householdFilter", JSON.stringify(selected));
			localStorage.setItem("ownerFilter", null);
		},
		[global.householdMembers]
	);

	const handleOwnerChange = useCallback((selected) => {
		setOwnerSelect(selected);
		setFilters((prevFilters) => ({
			...prevFilters,
			owner: selected,
		}));
		localStorage.setItem("ownerFilter", JSON.stringify(selected));
	}, []);

	const getOwners = (members, householdId = null) => {
		if (!householdId || householdId === "all" || householdId === "none") {
			setOwners([
				{ value: "all", label: "All members" },

				..._.uniqBy(members, "user_id")
					.filter(
						(owner) =>
							owner.invite_accepted && !owner.invite_declined
					)
					.map((owner) => {
						return {
							value: owner.user_id,
							label: owner.member_first,
						};
					}),
			]);
		} else {
			setOwners([
				{ value: "all", label: "All members" },
				...[...new Set(members)]
					.filter(
						(owner) =>
							Number(owner.household_id) === Number(householdId)
					)
					.map((owner) => {
						return {
							value: owner.user_id,
							label: owner.member_first,
						};
					}),
			]);
		}
	};

	const getHouseholdOptions = useCallback(() => {
		let options;
		if (global.households.length < 1) {
			options = [
				{ value: "none", label: `⛔ None (Only your own books)` },
				{
					value: "no-households",
					label: `🏠 You don't have any households! Add one from Profile`,
				},
			];
		} else if (global.households.length === 1) {
			options = global.households
				.filter(
					(household) =>
						household.invite_accepted && !household.invite_declined
				)
				.map((household) => {
					return {
						value: household.household_id,
						label: `🏠 ${household.name}`,
					};
				});

			options.unshift({
				value: "none",
				label: `⛔ None (Only your own books)`,
			});
		} else {
			options = global.households.map((household) => {
				return {
					value: household.household_id,
					label: `🏠 ${household.name}`,
				};
			});
			options.unshift({ value: "all", label: `🏠 All households` });
			options.unshift({
				value: "none",
				label: `⛔ None (Only your own books)`,
			});
		}

		return options;
	}, [global.households]);

	const handleSearch = (value, accessor) => {
		setActivePage(1);

		console.log(value, accessor);

		if (value) {
			setFilters((prevFilters) => ({
				...prevFilters,
				[accessor || "global"]: value,
			}));
		} else {
			setFilters((prevFilters) => {
				const updatedFilters = { ...prevFilters };
				delete updatedFilters[accessor || "global"];
				return updatedFilters;
			});
		}
	};

	const handleSort = (accessor) => {
		setActivePage(1);
		setSort((prevSort) => ({
			order:
				prevSort.order === "asc" && prevSort.orderBy === accessor
					? "desc"
					: "asc",
			orderBy: accessor,
		}));
	};

	const clearAll = () => {
		setSort({ order: "asc", orderBy: "id" });
		setHouseholdSelect(null);
		setOwnerSelect(null);
		setActivePage(1);
		setFilters({});
	};

	useEffect(() => {
		getOwners(global.householdMembers, householdSelect.value);
		setHouseholdOptions(getHouseholdOptions());
		getSavedHouseholdSelect();
		getSavedOwnerSelect();
		setFilters({
			householdSelect: getSavedHouseholdSelect(),
			owner: getSavedOwnerSelect(),
		});
	}, [global.householdMembers, getHouseholdOptions]);

	return (
		<>
			<div className="w-full">
				<div className="flex w-full">
					<div className="flex-1">
						<Select
							className="cursor-pointer"
							isOptionDisabled={(option) =>
								option.value === "no-households"
							}
							placeholder="Household..."
							blurInputOnSelect
							isSearchable={false}
							options={householdOptions}
							value={householdSelect}
							onChange={handleHouseholdChange}
						></Select>
					</div>
					{householdSelect.value === "none" || viewPrivate ? null : (
						<div className="flex-1 ml-1">
							<Select
								className="cursor-pointer"
								isOptionDisabled={(option) =>
									option.value === "no-households"
								}
								placeholder="Owner..."
								blurInputOnSelect
								isSearchable={false}
								options={owners}
								value={ownerSelect}
								onChange={handleOwnerChange}
							></Select>
						</div>
					)}
				</div>
				<input
					className="w-full h-12 p-2 border-2 rounded"
					key={`global-search`}
					type="search"
					placeholder={`Search books (${count})...`}
					value={filters.global}
					onChange={(event) => handleSearch(event.target.value)}
				/>
			</div>
			<table className="w-full">
				<thead>
					<tr>
						{columns.map((column) => {
							const sortIcon = () => {
								if (column.accessor === "cover") {
									return null;
								} else {
									if (column.accessor === sort.orderBy) {
										if (sort.order === "asc") {
											return "⬆️";
										}
										return "⬇️";
									} else {
										return "️↕️";
									}
								}
							};
							return (
								<th key={column.accessor}>
									<span>{column.label}</span>
									<button
										onClick={() =>
											handleSort(column.accessor)
										}
									>
										{sortIcon()}
									</button>
								</th>
							);
						})}
					</tr>
					{/* <tr>
						{columns.map((column) => {
							return (
								<th>
									<input
										key={`${column.accessor}-search`}
										type="search"
										placeholder={`Search ${column.label}`}
										value={filters[column.accessor]}
										onChange={(event) =>
											handleSearch(
												event.target.value,
												column.accessor
											)
										}
									/>
								</th>
							);
						})}
					</tr> */}
				</thead>
				<tbody>
					{calculatedRows.map((row) => {
						return (
							<tr
								className="cursor-pointer h-12 hover:bg-gray-200"
								onClick={() => history.push(`/book/${row.id}`)}
								key={row.id}
							>
								{columns.map((column) => {
									if (column.format) {
										return (
											<td key={column.accessor}>
												{column.format(
													row[column.accessor]
												)}
											</td>
										);
									}
									return (
										<td key={column.accessor}>
											{row[column.accessor]}
										</td>
									);
								})}
							</tr>
						);
					})}
				</tbody>
			</table>

			{count > 0 ? (
				<Pagination
					activePage={activePage}
					count={count}
					rowsPerPage={rowsPerPage}
					totalPages={totalPages}
					setActivePage={setActivePage}
				/>
			) : null}

			<div>
				<p>
					<button onClick={clearAll}>Clear all</button>
				</p>
			</div>
		</>
	);
};

export default withRouter(Table);
