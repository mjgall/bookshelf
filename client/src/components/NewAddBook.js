import React, { useState, useRef, useContext } from "react";
import Modal from "../common/Modal/Modal";
import { Context } from "../globalContext";
import Scanner from "./Scanner2";
import axios from "axios";
import DetailsTab from "./DetailsTab";
import { PlusCircleIcon as PlusCircle } from "@heroicons/react/outline";
import { ArrowLeftSquare } from "@styled-icons/bootstrap";


const Button = ({ text, action, children }) => {
    return (
        <div onClick={action} className="bg-newblue hover:bg-blue-700 text-white py-2 px-3 rounded focus:outline-none focus:shadow-outline text-center cursor-pointer">
            {children}
        </div>
    )
}

const AddBook = ({ closeModal }) => {
    const addBookModal = useRef(null);
    const scanTabRef = useRef(null);
    const [selection, setSelection] = useState(undefined)
    const global = useContext(Context);
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
                    addBookModal.current.open()
                }}
            >
                <div className="flex items-center justify-center">
                    <PlusCircle className="h-6 w-6" aria-hidden="true" />
                    <span className="hidden md:inline-block">Add Book</span>
                </div>
            </div>
            <Modal ref={addBookModal} header="Add book" type="addBook">
                <>
                    {global.capturedBook ? "We got one" : <>
                        {selection ? <div onClick={() => setSelection(undefined)} className="flex"><ArrowLeftSquare className="h-6 w-6 cursor-pointer" aria-hidden="true"></ArrowLeftSquare><span className="text-lg font-bold">Back</span></div> : <>

                            <Button action={() => setSelection("search")}>Search</Button>
                            <Button action={() => setSelection("scan")}>Scan barcode</Button>
                            <Button action={() => setSelection("manual")}>Manually</Button>

                        </>}
                        {global.capturedBook ? <BookDetails closeModal={() => addBookModal.current.close()}></BookDetails> : <div>
                            {renderActiveSelection()}
                        </div>}
                    </>}
                </>
            </Modal>
        </>
    );
};

export default AddBook;
