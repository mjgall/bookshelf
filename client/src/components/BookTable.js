import React, { useMemo, useState, useContext, useEffect } from 'react';
import {
  useTable,
  useSortBy,
  useGlobalFilter,
  useAsyncDebounce,
} from 'react-table';
import Select from 'react-select';
import _ from 'lodash';
import { Context } from '../globalContext';
import { withRouter } from 'react-router-dom';

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
    <div className='flex'>
      <input
        className='px-3'
        value={value || ''}
        onChange={(e) => {
          setValue(e.target.value);
          onChange(e.target.value);
        }}
        placeholder={`Search ${count} books...`}
        style={{
          height: '4rem',
          width: '100%',
          fontSize: '1.5rem',
        }}
      />
    </div>
  );
};

const BookTable = (props) => {
  const global = useContext(Context);
  const [householdOptions, setHouseholdOptions] = useState([]);

  const getSavedHouseholdSelect = () => {
    const localSaved = JSON.parse(localStorage.getItem('householdFilter'));
    if (localSaved) {
      return localSaved;
    } else {
      return {
        value: 'none',
        label: 'Select household...',
      };
    }
  };

  const getSavedOwnerSelect = () => {
    const localSaved = JSON.parse(localStorage.getItem('ownerFilter'));
    if (localSaved) {
      return localSaved;
    } else {
      return {
        value: 'all',
        label: 'All members',
      };
    }
  };

  const [householdSelect, setHouseholdSelect] = useState(
    getSavedHouseholdSelect()
  );

  const [ownerSelect, setOwnerSelect] = useState(getSavedOwnerSelect());
  const [owners, setOwners] = useState([]);

  const getOwners = (members, householdId = null) => {
    if (!householdId || householdId === 'all' || householdId === 'none') {
      setOwners([
        { value: 'all', label: 'All members' },

        ..._.uniqBy(members, 'user_id').map((owner) => {
          return { value: owner.user_id, label: owner.member_first };
        }),
      ]);
    } else {
      setOwners([
        { value: 'all', label: 'All members' },
        ...[...new Set(members)]
          .filter(
            (owner) => Number(owner.household_id) === Number(householdId)
          )
          .map((owner) => {
            return { value: owner.user_id, label: owner.member_first };
          }),
      ]);
    }
  };

  useEffect(() => {
    
    const getHouseholdOptions = () => {
      let options;
      if (global.households.length < 1) {
        options = [
          { value: 'none', label: `⛔ None (Only your own books)` },
          {
            value: 'no-households',
            label: `🏠 You don't have any households! Add one from Profile`,
          },
        ];
      } else if (global.households.length === 1) {
        options = global.households.map((household) => {
          return {
            value: household.household_id,
            label: `🏠 ${household.name}`,
          };
        });
        options.unshift({
          value: 'none',
          label: `⛔ None (Only your own books)`,
        });
      } else {
        options = global.households.map((household) => {
          return {
            value: household.household_id,
            label: `🏠 ${household.name}`,
          };
        });
        options.unshift({ value: 'all', label: `🏠 All households` });
        options.unshift({
          value: 'none',
          label: `⛔ None (Only your own books)`,
        });
      }

      return options;
    };
    getOwners(global.householdMembers)
    setHouseholdOptions(getHouseholdOptions());
  }, [global.households, global.householdMembers]);

  const columns = useMemo(() => {
    return [
      {
        Header: 'Title',
        accessor: 'title',
        disableFilters: true,
        isVisible: true,
      },
      {
        Header: 'Author',
        accessor: 'author',
        disableFilters: true,
        isVisible: true,
      },
      {
        Header: 'Cover',
        Cell: (props) => {
          return (
            <img
              width='5rem'
              loading='lazy'
              className='w-12 container'
              src={props.row.original.cover}
              alt='cover'></img>
          );
        },
      },
    ];
  }, []);

  const data = useMemo(() => {
    const filterBooks = (books, householdSelect, ownerSelect) => {
      if (householdSelect.value == null) {
        return books;
      } else if (householdSelect.value === 'none') {
        return books.filter(
          (book) => Number(book.user_id) === global.currentUser.id
        );
      } else if (
        householdSelect.value === 'all' &&
        ownerSelect.value === 'all'
      ) {
        return books;
      } else {
        const newBooks = books.filter((book) => {
          if (ownerSelect.value === 'all') {
            return (
              Number(book.household_id) === Number(householdSelect.value) ||
              book.household_id === null
            );
          } else {
            return book.user_id === Number(ownerSelect.value);
          }
        });
        return newBooks;
      }
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
    global.currentUser.id,
    props.sharedShelf,
    householdSelect,
    ownerSelect,
    props.books,
    global.householdMembers,
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
        sortBy: [{ id: 'author', desc: false }],
      },
    },
    useGlobalFilter,
    useSortBy
  );
  const handleHouseholdChange = (selected) => {
    getOwners(global.householdMembers, selected.value);
    setHouseholdSelect(selected);
    setOwnerSelect({ label: 'All members', value: 'all' });
    localStorage.setItem('householdFilter', JSON.stringify(selected));
    localStorage.setItem('ownerFilter', null);
  };

  const handleOwnerChange = (selected) => {
    setOwnerSelect(selected);
    localStorage.setItem('ownerFilter', JSON.stringify(selected));
  };

  return (
    <>
      <div className='max-w-screen-lg mx-auto mb-6 grid md:grid-cols-2 md:gap-2 grid-cols-1 row-gap-2'>
        {props.sharedShelf ? null : (
          <Select
            isOptionDisabled={(option) => option.value === 'no-households'}
            placeholder='Household...'
            blurInputOnSelect
            isSearchable={false}
            className='w-full container'
            options={householdOptions}
            value={householdSelect}
            onChange={handleHouseholdChange}></Select>
        )}
        {householdSelect.value === 'none' || props.sharedShelf ? null : (
          <Select
            isOptionDisabled={(option) => option.value === 'no-households'}
            placeholder='Owner...'
            blurInputOnSelect
            isSearchable={false}
            className='w-full container'
            options={owners}
            value={ownerSelect}
            onChange={handleOwnerChange}></Select>
        )}
      </div>

      <table
        {...getTableProps()}
        className='max-w-screen-lg container shadow-md text-xs md:text-base'>
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th
                  {...column.getHeaderProps(column.getSortByToggleProps())}
                  className='px-4 py-2 border'>
                  {column.render('Header')}

                  <span>
                    {column.isSorted
                      ? column.isSortedDesc
                        ? ' 🔽'
                        : ' 🔼'
                      : null}
                  </span>
                </th>
              ))}
            </tr>
          ))}
          <tr className='border leading-11'>
            <th
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
                className={`hover:bg-gray-100 ${
                  global.currentUser ? 'cursor-pointer' : ''
                }  ${row.original.read ? 'bg-green-100' : ''}`}
                onClick={() => {
                  const bookRow = row.original;
                  if (global.currentUser && !props.sharedShelf) {
                    if (Number(bookRow.user_id) === global.currentUser.id) {
                      props.history.push(
                        `/book/owned/${row.original.user_book_id}`
                      );
                    } else {
                      props.history.push(`/book/household/${row.original.id}`);
                    }
                  } else if (global.currentUser && props.sharedShelf) {
                    switch (props.relation) {
                      case 'self':
                        props.history.push(`/book/owned/${row.original.id}`);
                        break;
                      case 'household':
                        props.history.push(
                          `/book/household/${row.original.global_id}`
                        );
                        break;
                      case 'none':
                        props.history.push(`/book/${row.original.global_id}`);
                        break;
                      default:
                        break;
                    }
                  } else return;
                }}>
                {row.cells.map((cell) => {
                  return (
                    <td {...cell.getCellProps()} className='border px-4 py-2'>
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
};

export default withRouter(BookTable);
