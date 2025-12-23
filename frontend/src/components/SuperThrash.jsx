import axios from "axios";
import React from "react";
import { HiOutlineExclamationCircle } from "react-icons/hi";

const SuperThrash = ({ sprThrash, setShowModal, onClose, onMoveToTrashSuccess }) => {
  const handleMoveToTrash = async (id) => {
    try {
      await axios.patch(`/api/v1/auth/moveToTrash/${id}`);
      setShowModal(false);
      if (onMoveToTrashSuccess) onMoveToTrashSuccess(id); // Notify parent to update state
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="popup-overlay">
      <div className="popup-content" id="printable-popup">
        <div className="text-center">
          <HiOutlineExclamationCircle className="h-14 w-14 text-gray-400 text-gray-200 mb-4 mx-auto" />
          <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-400">
            Are you sure you want to unregister this user 
          </h3>
          <div className="d-flex justify-content-center gap-4">
            <button
              className="btn btn-danger"
              onClick={() => handleMoveToTrash(sprThrash)}
            >
              Yes, Move to Trash
            </button>
            <button className="btn btn-warning" color="gray" onClick={onClose}>
              No, Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuperThrash;
