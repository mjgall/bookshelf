import axios from "axios";
import React, { useCallback, useState, useRef, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import Modal from "../common/Modal/Modal";

const FileUpload = ({ onUpload }) => {
	const [files, setFiles] = useState([]);
	const [acceptedFiles, setAcceptedFiles] = useState([]);

	const modal = useRef(null);

	const onDrop = useCallback(async (acceptedFiles) => {
		setAcceptedFiles(acceptedFiles);
		setFiles(
			acceptedFiles.map((file) =>
				Object.assign(file, {
					preview: URL.createObjectURL(file),
				})
			)
		);
	}, []);

	const { getRootProps, getInputProps } = useDropzone({
		onDrop,
		accept: "image/jpeg, image/png",
	});

	const thumbs = files.map((file) => (
		<div key={file.name}>
			<img className="h-64" src={file.preview} alt={file.name} />
		</div>
	));

	// clean up
	useEffect(
		() => () => {
			files.forEach((file) => URL.revokeObjectURL(file.preview));
		},
		[files]
	);

	const submit = async () => {
		acceptedFiles.forEach((file) => {
			const reader = new FileReader();

			reader.onabort = () => console.log("file reading was aborted");
			reader.onerror = () => console.log("file reading has failed");
			reader.onload = async () => {
				// Do whatever you want with the file contents
				const arrayBuffer = reader.result;
				console.log(file);
				function _arrayBufferToBase64(buffer) {
					var binary = "";
					var bytes = new Uint8Array(buffer);
					var len = bytes.byteLength;
					for (var i = 0; i < len; i++) {
						binary += String.fromCharCode(bytes[i]);
					}
					return window.btoa(binary);
				}

				const base64 = _arrayBufferToBase64(arrayBuffer);

				const uploaded = await axios.post("/api/upload", {
					...file,
					type: file.type,
					base64,
				});
				console.log(uploaded);
				onUpload(uploaded.data.file)
			};
			reader.readAsArrayBuffer(file);
		});
	};

	return (
		<div>

			<div {...getRootProps()}>
				<input {...getInputProps()} />
				<div>Drag and drop your images here.</div>
			</div>
			<div>{thumbs}</div>
			<button onClick={submit}>Submit</button>

		</div>
	);
};
export default FileUpload;
