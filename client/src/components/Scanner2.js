import React, { useState, useRef, useContext, useEffect } from "react";
import QuaggaScanner from "./QuaggaScanner";
import { Context } from "../globalContext";
import Select from "react-select";
import axios from "axios";
import Button from "../common/Button";

const Scanner = ({ onFound, currentTab }) => {
	const [scanning, setScanning] = useState(false);
	const [reason, setReason] = useState("");
	const [devices, setDevices] = useState([]);
	const [camera, setCamera] = useState("");
	const scannerRef = useRef(null);
	const global = useContext(Context);

	const captureISBN = async (isbn) => {
		let isNumerical = /^\d+$/.test(isbn);
		const index = global.books.userBooks.findIndex((element) => {
			console.log(element);

			return element.isbn10 == isbn || element.isbn13 == isbn;
		});

		if (isbn && isNumerical) {
			if (index >= 0) {
				setReason("This book has already been saved.");
			} else {
				await axios.get(`/api/book/lookup/${isbn}`).then((response) => {
					console.log(response.data);
					global.setGlobal({
						...global,
						capturedBook: response.data,
					});
				});
				onFound();
			}
		}
	};

	useEffect(() => {
		if (!currentTab) {
			return () => setScanning(false);
		}
	});

	const beginScanning = (value) => {
		setReason("");
		setScanning(!scanning);
	};

	return (
		<>
			<div className="text-center">
				{reason ? (
					<div className="w-1/2 m-auto text-center text-white bg-red-700 py-2 px-3 rounded-sm">
						{reason}
					</div>
				) : null}
				<Button onClick={beginScanning}>
					{scanning ? "Stop Camera" : "Start Camera"}
				</Button>

				<div
					ref={scannerRef}
					style={{
						position: "relative",
						display: scanning ? "block" : "none",
						width: "100%",
						// border: "3px solid red",
					}}
				>
					{/* <video style={{ width: window.innerWidth, height: 480, border: '3px solid orange' }}/> */}

					{scanning ? (
						<canvas
							className="drawingBuffer"
							style={{
								position: "absolute",
								top: "0px",
							}}
						/>
					) : null}
					<QuaggaScanner
						style={{ display: scanning ? "block" : "none" }}
						scanning={scanning}
						scannerRef={scannerRef}
						onDetected={(result) => {
							captureISBN(Number(result));
							setScanning(false);
						}}
					/>
				</div>
			</div>
		</>
	);
};

export default Scanner;
