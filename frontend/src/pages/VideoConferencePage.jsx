import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import toast from "react-hot-toast";
import "./VideoConferencePage.css";

const VideoConferencePage = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    maxParticipants: 100,
    recordingEnabled: true,
  });
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token");

  const handleCreateConference = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/v1/video-conference/create`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        toast.success("Conference created!");
        navigate(`/video-call/${response.data.data._id}`);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create conference");
    } finally {
      setLoading(false);
    }
  };

  const handleInstantMeeting = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/v1/video-conference/create`,
        {
          title: `Meeting - ${new Date().toLocaleString()}`,
          description: "Instant meeting",
          maxParticipants: 100,
          recordingEnabled: true,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        navigate(`/video-call/${response.data.data._id}`);
      }
    } catch (error) {
      toast.error("Failed to create instant meeting");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="video-conference-page">
      <div className="conference-hero">
        <div className="hero-content">
          <h1>Video Conferencing</h1>
          <p>Connect with your team instantly</p>

          <div className="action-buttons">
            <button
              className="btn btn-primary"
              onClick={handleInstantMeeting}
              disabled={loading}
            >
              {loading ? "Creating..." : "Start Instant Meeting"}
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => setShowModal(true)}
              disabled={loading}
            >
              Schedule Meeting
            </button>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Create Conference</h2>
            <form onSubmit={handleCreateConference}>
              <div className="form-group">
                <label>Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  placeholder="Conference title"
                  required
                />
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Conference description"
                  rows="4"
                />
              </div>

              <div className="form-group">
                <label>Max Participants</label>
                <input
                  type="number"
                  min="1"
                  max="500"
                  value={formData.maxParticipants}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      maxParticipants: parseInt(e.target.value),
                    })
                  }
                />
              </div>

              <div className="form-group checkbox">
                <label>
                  <input
                    type="checkbox"
                    checked={formData.recordingEnabled}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        recordingEnabled: e.target.checked,
                      })
                    }
                  />
                  Enable Recording
                </label>
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="btn btn-cancel"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? "Creating..." : "Create Conference"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoConferencePage;
