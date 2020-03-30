import React from 'react';
import Quagga from 'quagga';
import axios from 'axios';
// import Card from 'react-bootstrap/Card';

import Button from '../styles/Button';
import Input from '../styles/Input';
import Label from '../styles/Label';

import Modal from 'react-modal';

export default class Scanner extends React.Component {
  constructor() {
    super();

    // state contains references to as yet un-instantiated HTML elements, as well as arrays to store codes and urls
    this.state = {
      codes: [],
      books: [],
      labels: [],
      scannerActive: false,
      canvas: {},
      context: {},
      video: {},
      imageUrls: [],
      search_value: '',
      isOpen: false,
      currentBook: null,
      useCamera: false,
      alert: false
    };

    // react component class bindings for methods, for scope access.
    this.onDetectedHandler = this.onDetectedHandler.bind(this);
    this.startScanning = this.startScanning.bind(this);
    this.stopScanning = this.stopScanning.bind(this);
    this.captureImage = this.captureImage.bind(this);
  }

  componentDidMount = () => {
    // this.startScanning();
  };

  useCamera = () => {
    this.setState({ useCamera: !this.state.useCamera });
    if (!this.state.useCamera) {
      this.startScanning();
    } else {
      this.stopScanning();
    }
  };

  updateFunction = book => {
    const newUser = { ...this.props.user, books: [this.props.books, book] };
    this.props.onChange(newUser);
  };

  startScanning() {
    this.setState({
      scannerActive: true
    });

    Quagga.init(
      {
        inputStream: {
          name: 'Barcode Scanner',
          type: 'LiveStream',
          target: document.querySelector('#live-stream'),
          constraints: {
            width: 640,
            height: 240
          }
        },
        frequency: 2,
        decoder: {
          readers: ['ean_reader'],
          multiple: false
        },
        locate: true
      },
      this.quaggaInitCallback.bind(this)
    );
  }

  quaggaInitCallback(err) {
    if (err) {
      return;
    }

    // assign handler for barcode detection event
    Quagga.onDetected(this.onDetectedHandler);

    Quagga.start();

    // once Quagga barcode scanner has instantiated, barcode scanner HTML elements are present and ready to be attached to state.
    this.setState({
      canvas: document.querySelector('#live-stream canvas')
    });

    this.setState({
      context: this.state.canvas.getContext('2d'),
      video: document.querySelector('#live-stream video')
    });
  }

  // display alert if a barcode is scanned a second time.
  displayDuplicateAlert() {
    console.log('already scanned');
  }

  // destructure argument into the information we need, to avoid imperative variable declarations with all the usual verbose validity checks.
  onDetectedHandler({ codeResult }) {
    Quagga.offDetected();

    // check if the code is already in state, and alert if it is, or add to state and capture if not.
    // this.state.codes.includes(codeResult.code)
    //   ? this.displayDuplicateAlert()
    //   : (() => {
    //       this.captureImage();
    //       this.addDetectedCode(codeResult.code);
    //   })();
    (() => {
      this.captureImage();
      this.addDetectedCode(codeResult.code);
    })();

    /* re-assign handler to event listener with delay, because it was removed after successful barcode detection, 
    to prevent a stream of barcode detection events from being triggered and created a mess of multiple images.
    The delay gives the  user time to physically move the code away from the camera */
    setTimeout(() => {
      Quagga.onDetected(this.onDetectedHandler);
    }, 3000);
  }

  // save the image as a blob in local state
  captureImage() {
    // draw the image into an html canvas element from the video stream
    this.state.context.drawImage(
      this.state.video,
      0,
      0,
      this.state.canvas.width,
      this.state.canvas.height
    );
    // export blob from canvas element
    this.state.canvas.toBlob(blob => {
      // give blob a url
      const url = URL.createObjectURL(blob);
      // add blob url to state for access by the image list element
      this.setState({
        imageUrls: [...this.state.imageUrls, url]
      });
      // clear the canvas to be ready for the next scan
      this.state.context.clearRect(
        0,
        0,
        this.state.canvas.width,
        this.state.canvas.height
      );
    });
    this.alert();
  }

  alert = () => {
    this.setState({ alert: true });
    setTimeout(() => {
      this.setState({ alert: false });
    }, 300);
  };

  // add new detected barcode to state
  addDetectedCode(code) {
    this.setState({
      codes: [...this.state.codes, code],
      labels: [...this.state.labels, code]
    });

    this.getBook(code);
  }

  getBook = async code => {
    const response = await axios.get(`/api/book/lookup/${code}`);
    if (response.data) {
      this.setState({ currentBook: response.data });
      this.toggleModal();
    } else {
      return;
    }
  };

  // remove the scanner instance
  stopScanning() {
    Quagga.stop();
  }

  handleManualSubmit = e => {
    e.preventDefault();
    const isbn = this.state.manualISBN;
    this.setState({ manualISBN: '' });
    this.getBook(isbn);
  };

  handleManualChange = e => {
    this.setState({ manualISBN: e.target.value });
  };

  toggleModal = () => {
    this.setState({ isOpen: !this.state.isOpen });
  };

  addBook = async () => {
    const response = await axios.post('/api/books', {
      ...this.state.currentBook,
      cover: this.state.currentBook.image,
      author: this.state.currentBook.authors[0],
      isbn10: this.state.currentBook.isbn
    });
    console.log(response.data);
    this.updateFunction(this.state.currentBook);
    this.toggleModal();
  };

  render = () => {
    Modal.setAppElement(document.querySelector('#root'));
    Modal.defaultStyles = {
      overlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(255, 255, 255, 0.75)'
      },
      content: {
        position: 'absolute',
        top: '40px',
        left: '40px',
        right: '40px',
        bottom: '40px',
        border: '1px solid #ccc',
        borderRadius: '5px',
        background: '#fff',
        overflow: 'auto',
        WebkitOverflowScrolling: 'touch',
        outline: 'none',
        padding: '20px'
      }
    };
    return (
      <>
        <div
          // style={{ position: 'sticky', top: '0px' }}
          className={'scanner' + ' ' + this.props.className}>
          {this.state.alert ? (
            <div
              className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded absolute .z-50 w-full"
              role="alert">
              <strong className="font-bold">Scanned</strong>
            </div>
          ) : null}
          <div
            style={{ display: this.state.useCamera ? 'block' : 'none' }}
            id="live-stream"></div>

          <form
            onSubmit={this.handleManualSubmit}
            className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
            <div className="flex items-center justify-between">
              <Input
                placeholder="Type in ISBN or scan"
                onChange={this.handleManualChange}
                value={this.state.manualISBN}
                name="isbn"></Input>
              <Button onClick={this.useCamera}>
                {this.state.useCamera ? 'Close' : 'Scan'}
              </Button>
              <Button
                onClick={this.handleManualSubmit}
                className="inline-block">
                Submit
              </Button>
            </div>
          </form>
          <Modal
            className="custom-modal border-solid border-2 border-gray-600 w-1/2 rounded outline-none bg-white container mx-auto relative p-4"
            shouldCloseOnEsc
            shouldCloseOnOverlayClick
            isOpen={this.state.isOpen}>
            {this.state.currentBook ? (
              <div>
                <h3>{this.state.currentBook.title}</h3>
                <img
                  style={{ maxHeight: '50vh' }}
                  src={this.state.currentBook.image}
                  alt="cover"></img>
              </div>
            ) : null}
            <Button onClick={this.addBook}>Add</Button>
            <Button onClick={this.toggleModal}>Close</Button>
          </Modal>
        </div>
      </>
    );
  };
}
