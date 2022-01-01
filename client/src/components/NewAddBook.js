import React, { useState, useRef, useContext } from "react";
import Modal from "../common/Modal/Modal";
import { Context } from "../globalContext";
import Scanner from "./Scanner2";
import axios from "axios";
import useWindowSize from "../hooks/useWindowSize";
import DetailsTab from "./DetailsTab";
import { useToasts } from "react-toast-notifications";
import { PlusCircleIcon as PlusCircle } from "@heroicons/react/outline";

const Button = ({ text, action, children }) => {
    return (
        <div onClick={action} className="bg-newblue hover:bg-blue-700 text-white py-2 px-3 rounded focus:outline-none focus:shadow-outline text-center cursor-pointer">
            {children}
        </div>
    )
}

const AddBook = ({ closeModal }) => {
    const modal = useRef(null);
    const scanTabRef = useRef(null);
    const [selection, setSelection] = useState(undefined)
    const global = useContext(Context);
    const { addToast } = useToasts();
    const Scan = () => {
        return (
            <div
                ref={scanTabRef}
                className="md:w-3/4 m-auto h-8"
            >
                <Scanner
                    currentTab={
                        selection === "scan" ? true : false
                    }
                    onFound={() => console.log("found")}
                ></Scanner>
            </div>
        )
    }

    const Search = () => {
        return (
            <div>
                Search
            </div>
        )
    }

    const Manual = () => {
        return (
            <div>
                Manual
            </div>
        )
    }

    const BookDetails = ({ closeModal }) => {
        return (
            <>
                <DetailsTab closeModal={closeModal}></DetailsTab>
            </>
        )
    }

    const renderActiveSelection = () => {
        switch (selection) {
            case "search":
                return <Search></Search>
            case "scan":
                return <Scan></Scan>
            case "manual":
                return <Manual></Manual>
            default:
                break;
        }
    }


    return (
        <>
            <div
                className="cursor-pointer inline-block mx-1 text-sm px-4 py-1 leading-none border rounded text-green bg-green-600 text-white border-green-600 hover:border-white hover:bg-green-600 lg:mt-0 "
                onClick={() => {
                    modal.current.open()
                    addToast("Modal Open", {
                        appearance: "error",
                        autoDismiss: false,
                    });
                }}
            >
                <div className="flex items-center justify-center">
                    <PlusCircle className="h-6 w-6" aria-hidden="true" />
                    <span className="hidden md:inline-block">Add Book</span>
                </div>
            </div>
            <Modal ref={modal} header="Add book">
                <>
                    {selection ? <Button action={() => setSelection(undefined)}>Back</Button> : <>
                        <Button action={() => setSelection("search")}>Search</Button>
                        <Button action={() => setSelection("scan")}>Scan barcode</Button>
                        <Button action={() => setSelection("manual")}>Manually</Button>
                    </>}
                    {global.capturedBook ? <BookDetails closeModal={() => modal.current.close()}></BookDetails> : <div>
                        {renderActiveSelection()}
                    </div>}

                </>
            </Modal>
        </>
    );
};

export default AddBook;
