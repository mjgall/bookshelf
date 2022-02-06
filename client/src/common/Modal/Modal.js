import React, {
  useEffect,
  useImperativeHandle,
  useState,
  forwardRef,
  useCallback,
  useContext,
} from "react";
import { createPortal } from "react-dom";
import "./styles.css";
import { Context } from "../../globalContext";

const modalElement = document.getElementById("modal-root");

export function Modal(
  { children, fade = false, defaultOpened = false, header = "Header", type },
  ref
) {
  const [isOpen, setIsOpen] = useState(defaultOpened);
  const global = useContext(Context);
  const close = useCallback(
    (capturedBook, type) => {
      if (type === "addBook" && capturedBook) {
        global.deleteProperty("capturedBook");
      }
      setIsOpen(false);
    },
    [global]
  );

  useImperativeHandle(
    ref,
    () => ({
      open: () => setIsOpen(true),
      close,
    }),
    [close]
  );

  const handleEscape = useCallback(
    (event) => {
      if (event.keyCode === 27) close(global.capturedBook, type);
    },
    [close, global.capturedBook, type]
  );

  useEffect(() => {
    if (isOpen) document.addEventListener("keydown", handleEscape, false);
    return () => {
      document.removeEventListener("keydown", handleEscape, false);
    };
  }, [handleEscape, isOpen, global]);

  return createPortal(
    isOpen ? (
      <div className={`modal ${fade ? "modal-fade" : ""}`}>
        <div
          className="modal-overlay z-40"
          onClick={() => close(global.capturedBook, type)}
        />
        <div
          id="modal-container"
          className="bg-white mx-auto rounded shadow-lg z-50 md:max-w-xl w-full overflow-auto flex-col"
          style={{
            maxHeight: "calc(100vh - 10rem)",
            minHeight: "calc(30vh + 2rem)",
          }}
        >
          <div>
            <div className="px-4 py-3 border-b border-divider font-title text-lg font-semibold relative">
              {header}
            </div>
            <div className="px-4 py-3 h-full">{children}</div>
          </div>
        </div>
      </div>
    ) : null,
    modalElement
  );
}

export default forwardRef(Modal);
