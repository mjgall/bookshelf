import React, { useEffect, useState, useContext } from "react";
import { Context } from "../globalContext";
import { Link } from "react-router-dom";
import FileUpload from "./FileUpload";
const UploadModal = (props) => {
	const global = useContext(Context);

	return (
		<>
			<div className="flex flex-wrap py-6 px-8">
				<FileUpload type="cover-update" bookId={global.bookId}></FileUpload>
			</div>
		</>
	);
};

export default UploadModal;
