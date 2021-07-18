import { useEffect } from "react";
import Quagga from "@ericblade/quagga2";

const QuaggaScanner = ({ onDetected, scanning, scannerRef }) => {
	const handleProcessed = (result) => {
		const drawingCtx = Quagga.canvas.ctx.overlay;
		const drawingCanvas = Quagga.canvas.dom.overlay;
		drawingCtx.font = "24px Arial";
		drawingCtx.fillStyle = "green";

		if (result) {
			console.log('* quagga onProcessed', result);
			if (result.boxes) {
                drawingCtx.clearRect(0, 0, parseInt(drawingCanvas.getAttribute("width")), parseInt(drawingCanvas.getAttribute("height")));
                result.boxes.filter(function (box) {
                    return box !== result.box;
                }).forEach(function (box) {
                    Quagga.ImageDebug.drawPath(box, {x: 0, y: 1}, drawingCtx, {color: "green", lineWidth: 2});
                });
            }

            if (result.box) {
                Quagga.ImageDebug.drawPath(result.box, {x: 0, y: 1}, drawingCtx, {color: "#00F", lineWidth: 2});
            }

            if (result.codeResult && result.codeResult.code) {
                Quagga.ImageDebug.drawPath(result.line, {x: 'x', y: 'y'}, drawingCtx, {color: 'red', lineWidth: 3});
            }
		}
	};

	useEffect(() => {
		const getMedian = (arr) => {
			arr.sort((a, b) => a - b);
			const half = Math.floor(arr.length / 2);
			if (arr.length % 2 === 1) {
				return arr[half];
			}
			return (arr[half - 1] + arr[half]) / 2;
		};

		const getMedianOfCodeErrors = (decodedCodes) => {
			const errors = decodedCodes
				.filter((x) => x.error !== undefined)
				.map((x) => x.error);
			const medianOfErrors = getMedian(errors);
			return medianOfErrors;
		};

		let enumerations = 0;
		let results = [];

		const errorCheck = (result, stop) => {
			if (!onDetected) {
				return;
			}
			const err = getMedianOfCodeErrors(result.codeResult.decodedCodes);
			// if Quagga is at least 70% certain that it read correctly, then accept the code
			// AND
			// if the same result was found 3 times in a row -- Mike addition for better accuracy
			if (err < 0.30) {
				const code = result.codeResult.code;
				const length = results.length;

				let mostRecentFoundIndex = length - 1;

				if (length === 0) {
					mostRecentFoundIndex = 0;
					results = [...results, code];
				} else {
					mostRecentFoundIndex = length - 1;
				}

				if (results[mostRecentFoundIndex] === code) {
					results = [...results, code];
					enumerations++;

				} else {
					results = [];
					enumerations = 0;

				}

				if (enumerations > 1) {
					console.log("Confident!");
					results = [];
					onDetected(result.codeResult.code);
				} else {
					console.log("Hold still!");
				}
			}
		};

		if (!scanning) {
			Quagga.stop();
		} else {
			Quagga.init(
				{
					inputStream: {
						name: "Live",
						type: "LiveStream",
						target: scannerRef.current,
					},
					decoder: {
						readers: ["ean_reader"],
					},
				},
				function (err) {
					if (err) {
						Quagga.onProcessed(handleProcessed);

						console.log(err);

						return;
					}
					console.log("Initialization finished. Ready to start");
					Quagga.start();
					Quagga.onProcessed(handleProcessed);
					Quagga.onDetected((result) => {
						errorCheck(result);
					});
				}
			);
		}

		return () => {
			Quagga.stop();
			Quagga.offDetected((result) => errorCheck(result));
			Quagga.offProcessed(handleProcessed);
		};
	}, [onDetected, scannerRef, scanning]);

	return null;
};

export default QuaggaScanner;
