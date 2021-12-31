import axios from "axios";
import React, { useCallback, useState, useRef, useEffect, useMemo } from "react";
import { useDropzone } from "react-dropzone";
import { useToasts } from "react-toast-notifications";
import imageCompression from 'browser-image-compression';


const FileUpload = ({ onUpload }) => {
	const [files, setFiles] = useState([]);
	const [acceptedFiles, setAcceptedFiles] = useState([]);
	const [message, setMessage] = useState(undefined)
	const { addToast } = useToasts();

	const modal = useRef(null);


	const onDrop = useCallback(async (acceptedFiles) => {
		// if (acceptedFiles[0].size > 2000000) {
		// 	setMessage("Max file size is 2mb")
		// 	addToast("Max file size is 2mb", {
		// 		appearance: "error",
		// 		autoDismiss: true,
		// 	})
		// } else {
		setMessage(undefined)
		setAcceptedFiles(acceptedFiles);
		setFiles(
			acceptedFiles.map((file) =>
				Object.assign(file, {
					preview: URL.createObjectURL(file),
				})
			)
		);
		// }
	}, []);



	const { getRootProps, getInputProps, isDragActive, isDragAccept, isDragReject } = useDropzone({
		onDrop,
		accept: "image/jpeg, image/png",
		maxFiles: 1
	});
	const baseStyle = {
		flex: 1,
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		padding: '20px',
		borderWidth: 2,
		borderRadius: 2,
		borderColor: '#eeeeee',
		borderStyle: 'dashed',
		backgroundColor: '#fafafa',
		color: '#bdbdbd',
		outline: 'none',
		transition: 'border .24s ease-in-out'
	};

	const activeStyle = {
		borderColor: '#2196f3'
	};

	const acceptStyle = {
		borderColor: '#00e676'
	};

	const rejectStyle = {
		borderColor: '#ff1744'
	};

	const style = useMemo(() => ({
		...baseStyle,
		...(isDragActive ? activeStyle : {}),
		...(isDragAccept ? acceptStyle : {}),
		...(isDragReject ? rejectStyle : {})
	}), [
		isDragActive,
		isDragReject,
		isDragAccept
	]);

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

	const compressFile = async (file) => {
		console.log("Compressing...")
		const imageFile = file
		console.log('originalFile instanceof Blob', imageFile instanceof Blob); // true
		console.log(`originalFile size ${imageFile.size / 1024 / 1024} MB`);

		const options = {
			maxSizeMB: 1,
			useWebWorker: true
		}
		try {
			const compressedFile = await imageCompression(imageFile, options);
			console.log('compressedFile instanceof Blob', compressedFile instanceof Blob); // true
			console.log(`compressedFile size ${compressedFile.size / 1024 / 1024} MB`); // smaller than maxSizeMB
			console.log("Done compressing. Uploading now.")
			return compressedFile;
		} catch (error) {
			console.log(error);
		}
	}

	const submit = async () => {
		acceptedFiles.forEach(async (file) => {
			const compressed = await compressFile(file)
			const reader = new FileReader();
			reader.onabort = () => console.log("file reading was aborted");
			reader.onerror = () => console.log("file reading has failed");
			reader.onload = async () => {
				// Do whatever you want with the file contents
				const arrayBuffer = reader.result;
				function _arrayBufferToBase64(buffer) {
					var binary = "";
					var bytes = new Uint8Array(buffer);
					var len = bytes.byteLength;
					for (var i = 0; i < len; i++) {
						binary += String.fromCharCode(bytes[i]);
					}
					return window.btoa(binary);
				}

				function blobToBase64(blob) {
					return new Promise((resolve, _) => {
						const reader = new FileReader();
						reader.onloadend = () => resolve(reader.result);
						reader.readAsDataURL(blob);
					});
				}

				// const base64 = _arrayBufferToBase64(arrayBuffer);
				const base64 = await blobToBase64(compressed);


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
			<div>{message}</div>
			<div className="container cursor-pointer">
				<div {...getRootProps({ style })}>
					<input {...getInputProps()} />
					<p>Drop a file here, or click to select file</p>
				</div>
			</div>
			<div className="my-2">{thumbs}</div>
			<div className="bg-newblue hover:bg-blue-700 text-white py-2 px-3 rounded focus:outline-none focus:shadow-outline text-center cursor-pointer" onClick={submit}>Submit</div>
		</div>
	);
};
export default FileUpload;
