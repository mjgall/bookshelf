import React, { useMemo, useState, useContext, useEffect } from "react";
import {
  useTable,
  useSortBy,
  useGlobalFilter,
  useAsyncDebounce,
} from "react-table";
import Select from "react-select";
import _ from "lodash";
import { Context } from "../globalContext";
import { withRouter } from "react-router-dom";
import Tip from "../common/Tip";
import { EyeOffOutline } from "@styled-icons/evaicons-outline";

const GlobalFilter = ({
  preGlobalFilteredRows,
  globalFilter,
  setGlobalFilter,
}) => {
  const count = preGlobalFilteredRows.length;
  const [value, setValue] = React.useState(globalFilter);
  const onChange = useAsyncDebounce((value) => {
    setGlobalFilter(value || undefined);
  }, 200);

  return (
    <div className="flex">
      <input
        className="px-3"
        value={value || ""}
        onChange={(e) => {
          setValue(e.target.value);
          onChange(e.target.value);
        }}
        placeholder={`Search ${count} books...`}
        style={{
          height: "4rem",
          width: "100%",
          fontSize: "1.5rem",
        }}
      />
    </div>
  );
};

const BookTable = (props) => {
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

  const getSavedReadFilter = () => {
    const localSaved = JSON.parse(localStorage.getItem("readFilter"));
    if (localSaved) {
      return localSaved;
    } else {
      return false;
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
  const [householdOptions, setHouseholdOptions] = useState([]);
  const [viewPrivate, setViewPrivate] = useState(false);
  const [viewRead, setViewRead] = useState(getSavedReadFilter());
  const [householdSelect, setHouseholdSelect] = useState(
    getSavedHouseholdSelect()
  );
  const [ownerSelect, setOwnerSelect] = useState(getSavedOwnerSelect());
  const [owners, setOwners] = useState([]);

  const getOwners = (members, householdId = null) => {
    if (!householdId || householdId === "all" || householdId === "none") {
      setOwners([
        { value: "all", label: "All members" },

        ..._.uniqBy(members, "user_id")
          .filter((owner) => owner.invite_accepted && !owner.invite_declined)
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
          .filter((owner) => Number(owner.household_id) === Number(householdId))
          .map((owner) => {
            return {
              value: owner.user_id,
              label: owner.member_first,
            };
          }),
      ]);
    }
  };

  useEffect(() => {
    const getHouseholdOptions = () => {
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
    };
    // setBooks(props.books);
    getOwners(global.householdMembers);
    setHouseholdOptions(getHouseholdOptions());
    if (global.households.length < 1) {
      setHouseholdSelect({
        label: "⛔ None (Only your own books)",
        value: "none",
      });
    }
  }, [
    global.households,
    global.householdMembers,
    props.books,
    global.books.userBooks,
  ]);

  const columns = useMemo(() => {
    return [
      {
        Header: "Title",
        // accessor: "title",
        disableFilters: true,
        isVisible: true,
        Cell: (props) => {
          return (
            <div className="inline-flex align-middle items-center">
              <div style={{ minWidth: "1.25em" }}>
                {props.row.original.private ? (
                  <Tip
                    renderChildren
                    content="You've marked this book as private."
                    placement="right"
                  >
                    <EyeOffOutline
                      size="1.25em"
                      className="text-red-600"
                    ></EyeOffOutline>
                  </Tip>
                ) : null}
              </div>
              <div className="ml-2">{props.row.original.title}</div>
            </div>
          );
        },
      },
      {
        Header: "Author",
        accessor: "author",
        disableFilters: true,
        isVisible: true,
      },
      {
        Header: "Cover",
        Cell: (props) => {
          if (props.row.original.cover) {
            return (
              <img
                width="5rem"
                loading="lazy"
                className="w-12 container"
                src={props.row.original.cover}
                alt="cover"
              ></img>
            );
          } else {
            return null;
          }
        },
      },
    ];
  }, []);

  const handleHouseholdChange = (selected) => {
    getOwners(global.householdMembers, selected.value);
    setHouseholdSelect(selected);
    setOwnerSelect({ label: "All members", value: "all" });
    localStorage.setItem("householdFilter", JSON.stringify(selected));
    localStorage.setItem("ownerFilter", null);
  };

  const handleOwnerChange = (selected) => {
    setOwnerSelect(selected);
    localStorage.setItem("ownerFilter", JSON.stringify(selected));
  };

  const togglePrivate = () => {
    handleHouseholdChange({
      label: "⛔ None (Only your own books)",
      value: "none",
    });
    setViewPrivate(!viewPrivate);
  };

  const toggleRead = () => {
    handleHouseholdChange({
      label: "⛔ None (Only your own books)",
      value: "none",
    });
    setViewRead(!viewRead);
    localStorage.setItem("readFilter", JSON.stringify(!viewRead));
  };

  const data = useMemo(() => {
    let filterBooks = (books, householdSelect, ownerSelect) => {
      let filteredBooks;

      if (viewPrivate) {
        filteredBooks = books.filter((book) => book.private === 1);
      } else if (householdSelect.value == null) {
        filterBooks = books;
      } else if (householdSelect.value === "none") {
        filteredBooks = books.filter(
          (book) => Number(book.user_id) === props.user.id
        );
      } else if (
        householdSelect.value === "all" &&
        ownerSelect.value === "all"
      ) {
        return (filteredBooks = books);
      } else {
        const newBooks = books.filter((book) => {
          if (ownerSelect.value === "all") {
            return (
              Number(book.household_id) === Number(householdSelect.value) ||
              book.household_id === null
            );
          } else {
            return book.user_id === Number(ownerSelect.value);
          }
        });
        filteredBooks = newBooks;
      }

      if (viewRead) {
        filteredBooks = filteredBooks.filter((book) => book.read === 1);
      }

      return filteredBooks;
    };

    if (props.sharedShelf) {
      return props.books;
    } else {
      return filterBooks(
        props.books.map((book) => {
          return {
            ...book,
            author: book?.author,
            owner_name: props.sharedShelf
              ? null
              : global.householdMembers[
                  global.householdMembers.findIndex(
                    (member) => Number(member.user_id) === book.user_id
                  )
                ]?.member_first,
          };
        }),
        householdSelect,
        ownerSelect
      );
    }
  }, [
    props,
    householdSelect,
    ownerSelect,
    global.householdMembers,
    viewPrivate,
    viewRead,
  ]);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    state,
    preGlobalFilteredRows,
    setGlobalFilter,
  } = useTable(
    {
      columns,
      data,
      debug: true,
      initialState: {
        sortBy: [{ id: "author", desc: false }],
      },
    },
    useGlobalFilter,
    useSortBy
  );

  return (
    <div>
      <div className="flex items-center mb-2">
        {props.sharedShelf || global.households.length < 1 ? null : (
          <>
            <div className="flex-none">
              <div className="flex">
                <div className="flex items-center">
                  <div>Private Only</div>
                  <input
                    style={{
                      height: "1.5rem",
                      width: "1.5rem",
                    }}
                    className="mx-2 cursor-pointer"
                    type="checkbox"
                    checked={viewPrivate}
                    onChange={togglePrivate}
                  ></input>
                </div>
                <div className="flex items-center">
                  <div>Read</div>
                  <input
                    style={{
                      height: "1.5rem",
                      width: "1.5rem",
                    }}
                    className="mx-2 cursor-pointer"
                    type="checkbox"
                    checked={viewRead}
                    onChange={toggleRead}
                  ></input>
                </div>
              </div>
            </div>
            {viewPrivate ? null : (
              <div className="flex w-full">
                <div className="flex-1">
                  <Select
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
                {householdSelect.value === "none" ||
                props.sharedShelf ||
                viewPrivate ? null : (
                  <div className="flex-1 ml-1">
                    <Select
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
            )}
          </>
        )}
      </div>
      {data.length < 1 ? (
        <div className="my-1 text-gray-500 italic font-weight-light">
          You don't have any books yet - add some above!
        </div>
      ) : (
        <table
          {...getTableProps()}
          className="shadow-md text-xs md:text-base w-full"
        >
          <thead>
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <th
                    {...column.getHeaderProps(column.getSortByToggleProps())}
                    className="px-4 py-2 border"
                  >
                    {column.render("Header")}

                    <span>
                      {column.isSorted
                        ? column.isSortedDesc
                          ? " 🔽"
                          : " 🔼"
                        : null}
                    </span>
                  </th>
                ))}
              </tr>
            ))}
            <tr className="border leading-11">
              <th
                style={{
                  textAlign: "left",
                }}
              >
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
                  className={`hover:bg-gray-100 ${
                    global.currentUser ? "cursor-pointer" : ""
                  }  ${row.original.read ? "bg-green-100" : ""}`}
                  onClick={() => {
                    const book = row.original;

                    if (props.sharedShelf) {
                      props.history.push(`/book/${book.global_id}`, {
                        ownerId: book.user_id,
                        ownerFull: book.full,
                      });
                    } else {
                      props.history.push(`/book/${book.id}`);
                    }
                    // if (global.currentUser && !props.sharedShelf) {
                    //   if (Number(bookRow.user_id) === global.currentUser.id) {
                    //     props.history.push(
                    //       `/book/owned/${row.original.user_book_id}`
                    //     );
                    //   } else {
                    //     props.history.push(`/book/household/${row.original.id}`);
                    //   }
                    // } else if (global.currentUser && props.sharedShelf) {
                    //   switch (props.relation) {
                    //     case 'self':
                    //       props.history.push(`/book/owned/${row.original.id}`);
                    //       break;
                    //     case 'household':
                    //       props.history.push(
                    //         `/book/household/${row.original.global_id}`
                    //       );
                    //       break;
                    //     case 'none':
                    //       props.history.push(`/book/${row.original.global_id}`);
                    //       break;
                    //     default:
                    //       break;
                    //   }
                    // } else return;
                  }}
                >
                  {row.cells.map((cell) => {
                    return (
                      <td {...cell.getCellProps()} className="border px-4 py-2">
                        {cell.render("Cell")}{" "}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default withRouter(BookTable);
