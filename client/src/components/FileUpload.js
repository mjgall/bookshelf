import axios from "axios";
import React, { useCallback, useState, useEffect, useMemo } from "react";
import { useDropzone } from "react-dropzone";
import LoadingSpinner from "../components/LoadingSpinner";
import { useToasts } from "react-toast-notifications";

const FileUpload = ({ onUpload }) => {
	const [files, setFiles] = useState([]);
	const [acceptedFiles, setAcceptedFiles] = useState([]);
	const [uploading, setUploading] = useState(false);
	const { addToast } = useToasts();

	const onDrop = useCallback(
		async (acceptedFiles, fileRejections) => {
			if (fileRejections[0]?.errors?.length > 0) {
				addToast(
					fileRejections[0].errors[0].message ===
						"File is larger than 9999999 bytes"
						? "File must be less than 10mb"
						: fileRejections[0].errors[0].message,
					{
						appearance: "error",
						autoDismiss: true,
						autoDismissTimeout: 10000,
					}
				);
			} else {
				setAcceptedFiles(acceptedFiles);
				setFiles(
					acceptedFiles.map((file) =>
						Object.assign(file, {
							preview: URL.createObjectURL(file),
						})
					)
				);
			}
		},
		[addToast]
	);

	const {
		getRootProps,
		getInputProps,
		isDragActive,
		isDragAccept,
		isDragReject,
	} = useDropzone({
		onDrop,
		accept: "image/jpeg, image/png",
		maxFiles: 1,
		maxSize: 9999999,
	});

	const style = useMemo(() => {
		const baseStyle = {
			flex: 1,
			display: "flex",
			flexDirection: "column",
			alignItems: "center",
			padding: "20px",
			borderWidth: 2,
			borderRadius: 2,
			borderColor: "#eeeeee",
			borderStyle: "dashed",
			backgroundColor: "#fafafa",
			color: "#bdbdbd",
			outline: "none",
			transition: "border .24s ease-in-out",
		};

		const activeStyle = {
			borderColor: "#2196f3",
		};

		const acceptStyle = {
			borderColor: "#00e676",
		};

		const rejectStyle = {
			borderColor: "#ff1744",
		};
		return {
			...baseStyle,
			...(isDragActive ? activeStyle : {}),
			...(isDragAccept ? acceptStyle : {}),
			...(isDragReject ? rejectStyle : {}),
		};
	}, [isDragAccept, isDragActive, isDragReject]);

	const thumbs = files.map((file) => (
		<div key={file.name}>
			<img className="h-64 mx-auto" src={file.preview} alt={file.name} />
		</div>
	));

	// clean up
	useEffect(
		() => () => {
			files.forEach((file) => URL.revokeObjectURL(file.preview));
		},
		[files]
	);

	const arrayBufferToBase64 = (buffer) => {
		var binary = "";
		var bytes = new Uint8Array(buffer);
		var len = bytes.byteLength;
		for (var i = 0; i < len; i++) {
			binary += String.fromCharCode(bytes[i]);
		}
		return window.btoa(binary);
	};

	const submit = async () => {
		acceptedFiles.forEach(async (file) => {
			setUploading(true);
			const reader = new FileReader();
			reader.onabort = () => console.log("file reading was aborted");
			reader.onerror = () => console.log("file reading has failed");
			reader.onload = async () => {
				const arrayBuffer = reader.result;

				const base64 = arrayBufferToBase64(arrayBuffer);

				const uploaded = await axios.post("/api/upload", {
					...file,
					type: file.type,
					base64,
				});
				if (uploaded) {
					setUploading(false);
					onUpload(uploaded.data.file);
				} else {
					console.log("error uploading");
				}
			};
			reader.readAsArrayBuffer(file);
		});
	};

	return (
		<div className="h-full flex flex-col">
			<div className="container cursor-pointer">
				<div {...getRootProps({ style })}>
					<input {...getInputProps()} />
					<p>Drop a file here, or click to select file</p>
				</div>
			</div>
			{uploading ? (
				<LoadingSpinner></LoadingSpinner>
			) : (
				<div className="my-2">{thumbs}</div>
			)}
			<div className="mt-auto">
				{uploading || acceptedFiles.length === 0 ? (
					<div className="bg-newblue text-white py-2 px-3 rounded focus:outline-none focus:shadow-outline text-center cursor-not-allowed">
						Submit
					</div>
				) : (
					<div
						className="bg-newblue hover:bg-blue-700 text-white py-2 px-3 rounded focus:outline-none focus:shadow-outline text-center cursor-pointer"
						onClick={submit}
					>
						Submit
					</div>
				)}
			</div>
		</div>
	);
};
export default FileUpload;
