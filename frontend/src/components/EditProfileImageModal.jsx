import React, { useState } from "react";
import axios from "axios";

const EditProfileImageModal = ({
  isOpen,
  onClose,
  onImageUpdate,
  currentImage,
}) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleDeleteImage = async () => {
    try {
      setLoading(true);
      await axios.delete("/api/v1/auth/delete-profile-image");
      onImageUpdate(null);
      onClose();
    } catch (error) {
      console.error("Error deleting image:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async () => {
    if (!selectedImage) return;

    const formData = new FormData();
    formData.append("profileImage", selectedImage);

    for (let [key, value] of formData.entries()) {
      console.log(`${key}:`, value);
    }

    // OR log only specific field
    console.log("Profile image is:", formData.get("profileImage"));

    try {
      setLoading(true);
      const response = await axios.post(
        "/api/v1/auth/upload-profile-image",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      onImageUpdate(response.data.image);
      onClose();
    } catch (error) {
      console.error("Error uploading image:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h3>Edit Profile Image</h3>
          <button onClick={onClose} className="close-btn">
            &times;
          </button>
        </div>
        <div className="modal-body">
          {/* {currentImage && (
            <div className="current-image">
              <h4>Current Image</h4>
             

              <img
                src={`${
                  import.meta.env.VITE_REACT_APP_MAIN_URL
                }uploads/${currentImage}`}
                alt="agent"
              />

              <button
                className="btn btn-danger mt-2"
                onClick={handleDeleteImage}
                disabled={loading}
              >
                Delete Current Image
              </button>
            </div>
          )} */}

          <div className="upload-section mt-3">
            <input
              type="file"
              onChange={handleImageChange}
              accept="image/*"
              className="form-control"
            />

            {previewUrl && (
              <div className="preview-image mt-3">
                <h4>Preview</h4>
                <img
                  src={previewUrl}
                  alt="Preview"
                  style={{ maxWidth: "200px" }}
                />
              </div>
            )}
          </div>
        </div>
        <div className="modal-footer">
          <button
            className="btn btn-secondary"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            className="btn btn-primary"
            onClick={handleUpload}
            disabled={!selectedImage || loading}
          >
            Upload
          </button>
        </div>
      </div>
      <style jsx>{`
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.5);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
        }
        .modal-content {
          background: white;
          padding: 20px;
          border-radius: 8px;
          max-width: 500px;
          width: 90%;
        }
        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }
        .close-btn {
          background: none;
          border: none;
          font-size: 24px;
          cursor: pointer;
        }
        .modal-footer {
          margin-top: 20px;
          display: flex;
          justify-content: flex-end;
          gap: 10px;
        }
        .current-image,
        .preview-image {
          text-align: center;
          margin-bottom: 20px;
        }
      `}</style>
    </div>
  );
};

export default EditProfileImageModal;
