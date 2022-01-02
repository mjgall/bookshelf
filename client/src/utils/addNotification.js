import React from 'react'
import toast from 'react-hot-toast';


const addNotification = (message, status) => {
    toast.custom((t) => (
        <div
            className={`${t.visible ? 'animate-enter' : 'animate-leave'
                } max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
        >
            <div className="flex-1 w-0 p-4">
                <div className="flex items-start">
                    <div className="ml-3 flex-1">
                        <p className="text-sm font-medium text-gray-900">
                            {status === "error" ? "Error" : status === "success" ? "Success" : "Notification"}
                        </p>
                        <p className="mt-1 text-sm text-gray-500">
                            {message}
                        </p>
                    </div>
                </div>
            </div>
            <div className="flex border-l border-gray-200">
                <button
                    onClick={() => toast.dismiss(t.id)}
                    className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-newblue hover:text-newblue focus:outline-none focus:ring-2 focus:ring-newblue"
                >
                    Close
                </button>
            </div>
        </div>
    ))
}
export default addNotification;
