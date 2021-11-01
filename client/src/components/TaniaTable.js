import React, { useState, useMemo } from "react";
import { withRouter } from "react-router-dom";


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

const filterRows = (rows, filters) => {
	if (isEmpty(filters)) return rows;

	return rows.filter((row) => {
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
	const [activePage, setActivePage] = useState(1);
	const [filters, setFilters] = useState({});
	const [sort, setSort] = useState({ order: "asc", orderBy: "id" });
	const rowsPerPage = 10;

	const filteredRows = useMemo(
		() => filterRows(rows, filters),
		[rows, filters]
	);
	const sortedRows = useMemo(
		() => sortRows(filteredRows, sort),
		[filteredRows, sort]
	);
	const calculatedRows = paginateRows(sortedRows, activePage, rowsPerPage);

    console.log(calculatedRows);

	const count = filteredRows.length;
	const totalPages = Math.ceil(count / rowsPerPage);

	const handleSearch = (value, accessor) => {
		setActivePage(1);

		if (value) {
			setFilters((prevFilters) => ({
				...prevFilters,
				[accessor]: value,
			}));
		} else {
			setFilters((prevFilters) => {
				const updatedFilters = { ...prevFilters };
				delete updatedFilters[accessor];

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
		setActivePage(1);
		setFilters({});
	};

	return (
		<>
			<table>
				<thead>
					<tr>
						{columns.map((column) => {
							const sortIcon = () => {
								if (column.accessor === sort.orderBy) {
									if (sort.order === "asc") {
										return "⬆️";
									}
									return "⬇️";
								} else {
									return "️↕️";
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
					<tr>
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
					</tr>
				</thead>
				<tbody>
					{calculatedRows.map((row) => {
						return (
							<tr onClick={() => history.push(`/book/${row.id}`)} key={row.id}>
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
			) : (
				<p>No data found</p>
			)}

			<div>
				<p>
					<button onClick={clearAll}>Clear all</button>
				</p>
			</div>
		</>
	);
};

export default withRouter(Table);