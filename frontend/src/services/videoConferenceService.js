import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

const getHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
};

// Conference APIs
export const videoConferenceAPI = {
  createConference: (data) =>
    axios.post(`${API_BASE_URL}/api/v1/video-conference/create`, data, {
      headers: getHeaders(),
    }),

  getConference: (conferenceId) =>
    axios.get(`${API_BASE_URL}/api/v1/video-conference/${conferenceId}`, {
      headers: getHeaders(),
    }),

  listConferences: (params) =>
    axios.get(`${API_BASE_URL}/api/v1/video-conference/list`, {
      headers: getHeaders(),
      params,
    }),

  updateConference: (conferenceId, data) =>
    axios.put(`${API_BASE_URL}/api/v1/video-conference/${conferenceId}/update`, data, {
      headers: getHeaders(),
    }),

  endConference: (conferenceId) =>
    axios.post(`${API_BASE_URL}/api/v1/video-conference/${conferenceId}/end`, {}, {
      headers: getHeaders(),
    }),

  getConferenceStats: (conferenceId) =>
    axios.get(`${API_BASE_URL}/api/v1/video-conference/${conferenceId}/stats`, {
      headers: getHeaders(),
    }),
};

// Recording APIs
export const recordingAPI = {
  startRecording: (conferenceId) =>
    axios.post(
      `${API_BASE_URL}/api/v1/video-conference/${conferenceId}/recording/start`,
      {},
      { headers: getHeaders() }
    ),

  stopRecording: (recordingId, data) =>
    axios.post(
      `${API_BASE_URL}/api/v1/video-conference/${recordingId}/recording/stop`,
      data,
      { headers: getHeaders() }
    ),

  getRecordings: (conferenceId, params) =>
    axios.get(`${API_BASE_URL}/api/v1/video-conference/${conferenceId}/recordings`, {
      headers: getHeaders(),
      params,
    }),

  deleteRecording: (recordingId) =>
    axios.delete(`${API_BASE_URL}/api/v1/video-conference/${recordingId}/recording/delete`, {
      headers: getHeaders(),
    }),
};

// Message APIs
export const messageAPI = {
  sendMessage: (conferenceId, data) =>
    axios.post(
      `${API_BASE_URL}/api/v1/video-conference/${conferenceId}/messages/send`,
      data,
      { headers: getHeaders() }
    ),

  getMessages: (conferenceId, params) =>
    axios.get(`${API_BASE_URL}/api/v1/video-conference/${conferenceId}/messages`, {
      headers: getHeaders(),
      params,
    }),

  deleteMessage: (messageId) =>
    axios.delete(`${API_BASE_URL}/api/v1/video-conference/${messageId}/messages/delete`, {
      headers: getHeaders(),
    }),
};

// Participant APIs
export const participantAPI = {
  inviteParticipants: (conferenceId, emails) =>
    axios.post(
      `${API_BASE_URL}/api/v1/video-conference/${conferenceId}/invite`,
      { emails },
      { headers: getHeaders() }
    ),

  removeParticipant: (conferenceId, participantId) =>
    axios.delete(
      `${API_BASE_URL}/api/v1/video-conference/${conferenceId}/participant/${participantId}`,
      { headers: getHeaders() }
    ),
};

export default {
  videoConferenceAPI,
  recordingAPI,
  messageAPI,
  participantAPI,
};
