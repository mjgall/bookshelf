import React, { useState, useRef, useContext, useEffect } from "react";
import QuaggaScanner from "./QuaggaScanner";
import { Context } from "../globalContext";
import Select from "react-select";
import axios from "axios";
const Scanner = ({onFound}) => {
	const [scanning, setScanning] = useState(false);
	const [results, setResults] = useState([]);
	const [canCapture, setCanCapture] = useState([]);
	const [dims, setDims] = useState({});
	const [devices, setDevices] = useState([]);
	const [camera, setCamera] = useState("");
	const scannerRef = useRef(null);
	const global = useContext(Context);

	const captureISBN = async (isbn) => {
		await axios.get(`/api/book/lookup/${isbn}`).then((response) => {
			global.setGlobal({ ...global, capturedBook: response.data });
		});
		onFound()
	};

	const ableToCapture = () => {
		if (
			navigator.mediaDevices &&
			typeof navigator.mediaDevices.getUserMedia === "function"
		) {
			setCanCapture(true);
		}
	};

	const getCameras = async () => {
		await navigator.mediaDevices.getUserMedia({ video: true });
		let allDevices = await navigator.mediaDevices.enumerateDevices();
		let videoDevices = allDevices.filter((device) => {
			console.log(device.kind);
			return device.kind === "videoinput";
		});
		console.log(videoDevices);
		setDevices(videoDevices);
	};

	useEffect(() => {
		getCameras();
		ableToCapture();
		if (scanning) {
			const height = scannerRef.current.offsetHeight;
			const width = scannerRef.current.offsetWidth;

			setDims({ height, width });
		}
	}, [scannerRef, scanning]);

	return (
		<>
			{canCapture ? (
				<div>
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
					<ul className="results">
						{results.length > 0
							? results.map((result, index) => {
									return (
										<li key={index}>
											{" "}
											{JSON.stringify(result)}{" "}
										</li>
									);
							  })
							: null}
					</ul>
					<div
						ref={scannerRef}
						style={{
							position: "relative",
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
										// left: '50%',
										// height: '100%',
										// width: '100%',
										// border: "3px solid green",
									}}
									width={dims.width}
									height={dims.height}
									// width="640"
									// height="480"
								/>
								<QuaggaScanner
									scanning={scanning}
									constraints={({ ...dims }, camera)}
									camera={camera}
									scannerRef={scannerRef}
									onDetected={(result) => {
										// setResults([...results, result])
										setScanning(false);
										captureISBN(Number(result));
									}}
								/>
							</>
						) : null}
					</div>
				</div>
			) : null}
		</>
	);
};

export default Scanner;
