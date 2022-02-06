import React, { useContext, useEffect } from "react";
import Modal from "react-modal";
import { Context } from "../globalContext";
// import useWindowSize from "../hooks/useWindowSize";

import LoanModal from "../components/LoanModal";
import RequestToBorrowModal from "./RequestToBorrowModal";
import UploadModal from "./UploadModal";

const GlobalModal = () => {
  const global = useContext(Context);

  const toggleModal = () => {
    global.setGlobal({ modalOpen: !global.modalOpen });
  };

  // const size = useWindowSize();
  const modalStyles = {
    content: {
      // width: size.width > 500 ? "50vw" : "100%",
      // height: size.width > 500 ? "70vh" : "100%",
      minHeight: "20vh",
      maxHeight: "80vh",
      minWidth: "30vw",
      padding: 0,
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
      border: "1px solid black",
    },
  };

  const getModalContent = () => {
    switch (global.currentModal) {
      case "loan":
        return (
          <LoanModal
            bookId={global.bookId}
            userBookId={global.user_book_id}
          ></LoanModal>
        );
      case "requestToBorrow":
        return (
          <RequestToBorrowModal bookId={global.bookId}></RequestToBorrowModal>
        );
      case "upload":
        return <UploadModal></UploadModal>;
      default:
        break;
    }
  };

  useEffect(() => {
    Modal.setAppElement("body");
  }, []);

  return (
    <>
      <Modal
        shouldCloseOnEsc
        style={modalStyles}
        isOpen={global.modalOpen}
        onRequestClose={toggleModal}
      >
        {getModalContent()}
      </Modal>
    </>
  );
};

export default GlobalModal;
