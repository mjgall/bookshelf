import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { Context } from "../globalContext";
import { Link } from "react-router-dom";
const LoanModal = (props) => {
  const global = useContext(Context);
  const [connections, setConnections] = useState([]);
  const [manualEntry, setManualEntry] = useState([]);
  const fetchConnections = async () => {
    const result = await axios.get("/api/connections");

    setConnections(result.data);
  };



  useEffect(() => {
    fetchConnections();
  }, []);

  const loanTo = async (friendId, friendName) => {
    console.log(friendId, friendName);
    if (!friendId) {
      //this is an unregistered user we are loaning to
      await axios.post("/api/loans", {
        manualName: manualEntry,
        bookId: props.bookId,
        lenderId: global.currentUser.id,
      })

      const index = global.allBooks.findIndex(
        (book) => book.user_book_id === global.userBookId
      );

      let updatedAllBooks = [...global.allBooks];
      updatedAllBooks[index].on_loan = 1;
      // updatedAllBooks[index].borrower_id = friendId;
      updatedAllBooks[index].full = manualEntry;
      global.setGlobal({ allBooks: updatedAllBooks });
    } else {

      await axios.post("/api/loans", {
        bookId: props.bookId,
        lenderId: global.currentUser.id,
        borrowerId: friendId,
      });

      const index = global.allBooks.findIndex(
        (book) => book.user_book_id === global.userBookId
      );

      let updatedAllBooks = [...global.allBooks];
      updatedAllBooks[index].on_loan = 1;
      updatedAllBooks[index].borrower_id = friendId;
      updatedAllBooks[index].full = friendName;
      global.setGlobal({ allBooks: updatedAllBooks });

    }


  };

  const handleManualEntryChange = (e) => {
    setManualEntry(e.target.value);
  }

  return (
    <>
      <div className="flex flex-wrap py-6 px-8">
        <div>
          {connections.length < 1 ? (
            <div className="text-center text my-1 text-gray-500 italic font-weight-light">
              <div>
                You don't have any connections, create a household or connect
                with friends from
              </div>
              <Link
                onClick={() => global.setGlobal({ modalOpen: false })}
                className="border-gray-600 border-dotted border-b"
                to="/profile"
              >
                your profile.
              </Link>
            </div>
          ) : (
            <>
              <div>
                <div>Friends/Household Members</div>
                {connections.map((connection, index) => {
                  return (
                    <div
                      onClick={() => loanTo(connection.user_id, connection.full)}
                      key={index}
                      className="flex items-center my-2 cursor-pointer"
                    >
                      <img
                        alt={connection.full}
                        src={connection.picture}
                        className="rounded-full h-12 w-12 mr-4"
                      ></img>
                      <div>{connection.full}</div>
                    </div>
                  );
                })}
              </div>
              <div>
                <div>
                  Enter manually
                </div>
                <div>
                  <input onChange={handleManualEntryChange} value={manualEntry} className="border border-gray-400 rounded py-2 px-1">
                  </input>
                  <div>
                    <button class="bg-newblue hover:bg-blue-700 text-white my-1 py-1 px-4 rounded focus:outline-none focus:shadow-outline" type="submit" onClick={() => loanTo(null, manualEntry)}>Submit</button>
                  </div>
                </div>
              </div>

            </>
          )}
        </div>
      </div>
    </>
  );
};

export default LoanModal;
