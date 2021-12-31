import React, {
    useEffect,
    useImperativeHandle,
    useState,
    forwardRef,
    useCallback,
} from "react";
import { createPortal } from "react-dom";
import "./styles.css";

const modalElement = document.getElementById("modal-root");

export function Modal({ children, fade = false, defaultOpened = false, header = "Header", footer }, ref) {
    const [isOpen, setIsOpen] = useState(defaultOpened);

    const close = useCallback(() => setIsOpen(false), []);

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
            if (event.keyCode === 27) close();
        },
        [close]
    );

    useEffect(() => {
        if (isOpen) document.addEventListener("keydown", handleEscape, false);
        return () => {
            document.removeEventListener("keydown", handleEscape, false);
        };
    }, [handleEscape, isOpen]);

    return createPortal(
        isOpen ? (
            <div className={`modal  ${fade ? "modal-fade" : ""}`}>
                <div className="modal-overlay z-40" onClick={close} />
                <div
                    className="bg-white mx-auto rounded shadow-lg z-50 md:max-w-xl w-full h-full flex flex-col"
                    style={{ maxHeight: "calc(100vh - 10rem)" }}
                >
                    <div className="px-4 py-3 border-b border-divider font-title text-lg font-semibold relative">{header}</div>
                    <div className="px-4 py-3">{children}</div>
                </div>
            </div>
        ) : null,
        modalElement
    );
}

export default forwardRef(Modal);
