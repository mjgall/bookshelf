import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { Context } from "../globalContext";
import { Link } from "react-router-dom";
const LoanModal = (props) => {
    const global = useContext(Context);

    useEffect(() => {
        axios.get(`/api/book/lookup/${props.isbn}`).then((response) => {
            console.log(response)
        });
    }, [global, props.isbn])

    return (
        <>
            <div className="flex flex-wrap py-6 px-8">
                <div>
                    {props.isbn}
                </div>
            </div>
        </>
    );
};

export default LoanModal;
