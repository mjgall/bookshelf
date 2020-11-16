import React, { useState, useRef, useContext, useEffect } from "react";
import QuaggaScanner from "./QuaggaScanner";
import { Context } from "../globalContext";
import Select from "react-select";
import axios from "axios";

const Scanner = ({ onFound, currentTab }) => {
	const [scanning, setScanning] = useState(false);

	const [devices, setDevices] = useState([]);
	const [camera, setCamera] = useState("");
	const scannerRef = useRef(null);
	const global = useContext(Context);

	const captureISBN = async (isbn) => {
		await axios.get(`/api/book/lookup/${isbn}`).then((response) => {
			global.setGlobal({ ...global, capturedBook: response.data });
		});
		onFound();
	};

	useEffect(() => {
	if (!currentTab) {
		return () => setScanning(false)
	}
	})

	return (
		<>
			<div className="text-center">
				{devices.length > 1 ? (
					<Select
						options={devices}
						onChange={(choice) => {
							setCamera(choice.deviceId);
						}}
					></Select>
				) : null}

				<button onClick={() => setScanning(!scanning)}>
					{scanning ? "Stop" : "Start"}
				</button>
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
						<>
							<canvas
								className="drawingBuffer"
								style={{
									position: "absolute",
									top: "0px",
						
								}}
						
							/>
							<QuaggaScanner
								style={{ display: scanning ? "block" : "none" }}
								scanning={scanning}
								scannerRef={scannerRef}
								onDetected={(result) => {
									captureISBN(Number(result));
									setScanning(false)
								}}

							/>
						</>
					) : null}
				</div>
			</div>
		</>
	);
};

export default Scanner;
