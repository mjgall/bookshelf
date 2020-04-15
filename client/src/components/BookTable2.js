import React, { useState } from 'react';
import { useTable, useFilters, useSortBy, useGlobalFilter } from 'react-table';
import { withRouter } from 'react-router-dom';
import Book from './Book';
import matchSorter from 'match-sorter';
import MediaQuery, { useMediaQuery } from 'react-responsive';

// import matchSorter from 'match-sorter';

// Global string filter
function GlobalFilter({
  preGlobalFilteredRows,
  globalFilter,
  setGlobalFilter,
}) {
  const count = preGlobalFilteredRows.length;

  return (
    <div className="flex">
      <input
        className="px-3"
        value={globalFilter || ''}
        onChange={(e) => {
          setGlobalFilter(e.target.value || undefined); // Set undefined to remove the filter entirely
        }}
        placeholder={`Search ${count} books...`}
        style={{
          height: '2rem',
          width: '100%',
        }}
      />
    </div>
  );
}

// Define a default UI for filtering
function DefaultColumnFilter({
  column: { filterValue, preFilteredRows, setFilter },
}) {
  const count = preFilteredRows.length;

  return null;
  // return (
  //   <input
  //     value={filterValue || ''}
  //     onChange={(e) => {
  //       setFilter(e.target.value || undefined); // Set undefined to remove the filter entirely
  //     }}
  //     placeholder={`Search ${count} records...`}
  //   />
  // );
}

// This is a custom filter UI for selecting
// a unique option from a list
function SelectColumnFilter({
  column: { filterValue, setFilter, preFilteredRows, id },
}) {
  // Calculate the options for filtering
  // using the preFilteredRows
  const options = React.useMemo(() => {
    const options = new Set();
    preFilteredRows.forEach((row) => {
      options.add(row.values[id]);
    });
    return [...options.values()];
  }, [id, preFilteredRows]);

  // Render a multi-select box

  if (options.length === 1) {
    return null;
  } else {
    return (
      <select
        value={filterValue}
        onChange={(e) => {
          setFilter(e.target.value || undefined);
        }}>
        <option value="">All</option>
        {options.map((option, i) => (
          <option key={i} value={option}>
            {option}
          </option>
        ))}
      </select>
    );
  }
}

// table component
function Table({ columns, data, history, user }) {
  const filterTypes = React.useMemo(
    () => ({
      text: (rows, id, filterValue) => {
        return rows.filter((row) => {
          const rowValue = row.values[id];
          return rowValue !== undefined
            ? String(rowValue)
                .toLowerCase()
                .startsWith(String(filterValue).toLowerCase())
            : true;
        });
      },
      check: (rows, id, filterValue) => {
        console.log({ rows, id, filterValue });
      },
    }),
    []
  );

  const defaultColumn = React.useMemo(
    () => ({
      // Let's set up our default Filter UI
      Filter: DefaultColumnFilter,
    }),
    []
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    state,
    visibleColumns,
    preGlobalFilteredRows,
    setGlobalFilter,
  } = useTable(
    {
      columns,
      data,
      defaultColumn,
      debug: true,
      initialState: { sortBy: [{ id: 'author', desc: false }], filters: [{id: 'owner_name', value: user.first}] },
    },
    useFilters, // useFilters!
    useGlobalFilter, // useGlobalFilter!
    useSortBy
  );

  console.log(state);
  // We don't want to render all of the rows for this example, so cap
  // it for this use case
  const firstPageRows = rows.slice(0, 10);
  console.log(headerGroups);
  return (
    <>
      <table
        {...getTableProps()}
        className="max-w-screen-md container shadow-md text-xs md:text-base">
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th
                  {...column.getHeaderProps(column.getSortByToggleProps())}
                  className="px-4 py-2 border">
                  {column.render('Header')}

                  <span>
                    {column.isSorted
                      ? column.isSortedDesc
                        ? ' 🔽'
                        : ' 🔼'
                      : null}
                  </span>
                  {/* Render the columns filter UI */}
                  <div>{column.canFilter ? column.render('Filter') : null}</div>
                </th>
              ))}
            </tr>
          ))}
          <tr className="border leading-11">
            <th
              colSpan={visibleColumns.length}
              style={{
                textAlign: 'left',
              }}>
              <GlobalFilter
                preGlobalFilteredRows={preGlobalFilteredRows}
                globalFilter={state.globalFilter}
                setGlobalFilter={setGlobalFilter}
              />
            </th>
          </tr>
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map((row, i) => {
            prepareRow(row);
            return (
              <tr
                {...row.getRowProps()}
                className={`hover:bg-gray-100 cursor-pointer ${
                  row.original.read ? 'bg-green-100' : null
                }`}
                onClick={() => history.push(`/book/${row.original.id}`)}>
                {row.cells.map((cell) => {
                  return (
                    <td {...cell.getCellProps()} className="border px-4 py-2">
                      {cell.render('Cell')}{' '}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
}

function BookTable(props) {
  const columns = React.useMemo(() => {
    if (!props.books.every((book) => book.user_id == props.user.id)) {
      return [
        { Header: 'Title', accessor: 'title', disableFilters: true },
        { Header: 'Author', accessor: 'author', disableFilters: true },
        {
          Header: 'Cover',
          Cell: (props) => {
            return (
              <img
                loading="lazy"
                className="w-20 container"
                src={props.row.original.cover}
                alt="cover"></img>
            );
          },
        },
        {
          Header: 'Owner',
          accessor: 'owner_name',
          Filter: SelectColumnFilter,
          filter: 'equals',
        },
      ];
    } else {
      return [
        { Header: 'Title', accessor: 'title', disableFilters: true },
        { Header: 'Author', accessor: 'author', disableFilters: true },
        {
          Header: 'Cover',
          Cell: (props) => {
            return (
              <img
                loading="lazy"
                className="w-20 container"
                src={props.row.original.cover}
                alt="cover"></img>
            );
          },
        },
      ];
    }
  }, []);

  const data = React.useMemo(() => {
    return props?.books?.map((book) => {
      return {
        ...book,
        author: book?.author,
        owner_name:
          props.members[
            props.members.findIndex((member) => member.user_id == book.user_id)
          ].member_first,
      };
    });
  }, [props.books]);

  return <Table history={ props.history } columns={ columns } data={ data } user={props.user}/>;
}

export default BookTable;
