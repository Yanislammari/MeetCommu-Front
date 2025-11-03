import React from "react";
import { FaTimes } from "react-icons/fa";

interface LogoutConfirmationModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const LogoutConfirmationModal: React.FC<LogoutConfirmationModalProps> = (props: LogoutConfirmationModalProps) => {
  if (!props.isOpen) {
    return null;
  }

  return (
    <dialog className="modal modal-open">
      <div className="modal-box bg-[#1e1e2f] text-gray-100 border border-white/10 rounded-2xl shadow-lg relative">
        <button aria-label="Close" onClick={props.onCancel} className="btn btn-sm btn-circle absolute right-4 top-4 bg-black/50 hover:bg-black/70 text-white border-0">
          <FaTimes />
        </button>
        <div className="flex flex-col items-center text-center space-y-3 mt-2">
          <h3 className="text-xl font-semibold text-[#9b8af7]">Confirm Logout</h3>
          <p className="text-sm text-gray-300">Are you sure you want to log out? You’ll need to log back in to access your account.</p>
        </div>
        <div className="modal-action justify-center mt-6 space-x-2">
          <button onClick={props.onCancel} className="btn btn-sm bg-transparent border border-white/20 hover:bg-white/10 text-gray-300 px-6"><p>Cancel</p></button>
          <button onClick={props.onConfirm} className="btn btn-sm bg-red-600 hover:bg-red-700 border-none text-white px-6"><p>Logout</p></button>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button onClick={props.onCancel}><p>Close</p></button>
      </form>
    </dialog>
  );
}

export default LogoutConfirmationModal;
