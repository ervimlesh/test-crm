import React, { useEffect, useRef, useState } from "react";
import { HiOutlineDotsVertical } from "react-icons/hi";
import axios from "axios";
import toast from "react-hot-toast";
import { getSocket } from "../../context/SocketContext.jsx";
import { useAuth } from "../../context/Auth.jsx";
import { useAllTeams } from "../../context/AllTeamsContext.jsx";
import { useLocation } from "react-router-dom";
import { debounce } from "lodash";

const getLastWord = (input) => {
  const words = input.trim().split(/\s+/);
  return words[words.length - 1] || "";
};

const Chatbot = () => {
  const { auth } = useAuth();
  const { agent } = useAllTeams();
  const socket = getSocket();
  const location = useLocation();

  const [showChat, setShowChat] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState([]);
  const [bookingPreview, setBookingPreview] = useState("");
  const chatEndRef = useRef(null);
  const popupRef = useRef(null);

  const [taggedAgent, setTaggedAgent] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [openSeenList, setOpenSeenList] = useState(null);
  const [seenByList, setSeenByList] = useState([]);

  // ====================================================================================
  // ✅ BOOKING TEXT FIX — CLEAR FOR ALL USERS
  // ====================================================================================
  useEffect(() => {
    if (location.state?.bookingText) {
      setShowChat(true);
      setBookingPreview(location.state.bookingText);
      setChatInput("");
    }

    function handleClickOutside(event) {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setOpenSeenList(null); // close popup
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [location.state]);

  // ====================================================================================
  // ✅ FETCH CHAT HISTORY (Auto-Refresh Safe)
  // ====================================================================================
  const fetchChatHistory = async () => {
    try {
      const res = await axios.get("/api/v1/groupchat/history");
      if (res.data.success) {
        const formatted = res.data.messages.map((msg) => ({
          ...msg,
          senderId:
            msg.senderId && typeof msg.senderId === "object"
              ? msg.senderId._id
              : msg.senderId,
          senderName:
            msg.senderName ||
            (msg.senderId && msg.senderId.userName
              ? msg.senderId.userName
              : "Unknown"),
          seenBy: msg.seenBy || [],
          taggedAgent: msg.taggedAgent || null,
        }));
        setChatMessages(formatted);
      }
    } catch {
      setChatMessages([]);
    }
  };

  useEffect(() => {
    if (showChat) fetchChatHistory();

    // ✅ Safe auto-refresh every 30s (if chat open)
    const interval = showChat ? setInterval(fetchChatHistory, 1000) : null;
    return () => interval && clearInterval(interval);
  }, [showChat]);

  // ====================================================================================
  // ✅ SEEN LIST POPUP FETCH
  // ====================================================================================
  const handleSeenListToggle = async (msg, idx) => {
    console.log("upcoming message informatin is", msg, "with index :", idx);
    console.log("before condition openSeenList", openSeenList);

    if (openSeenList === idx) {
      setOpenSeenList(null);
      setSeenByList([]);
    } else {
      setOpenSeenList(idx);
      console.log("after else loop openSeenList", openSeenList);

      try {
        const res = await axios.get(`/api/v1/groupchat/seen-by/${msg._id}`);
        const filtered = (res.data.seenBy || []).filter(
          (u) => String(u._id || u) !== String(auth?.user?._id)
        );
        setSeenByList(filtered);
      } catch (err) {
        console.log(err);
      }
    }
  };

  // ====================================================================================
  // ✅ AUTO MARK SEEN — Optimized, Debounced, No Spam
  // ====================================================================================
  const seenCache = useRef(new Set());

  const markSeen = async (messageId) => {
    if (!messageId || seenCache.current.has(messageId)) return;
    seenCache.current.add(messageId);

    try {
      await axios.post(`/api/v1/groupchat/seen-by/${messageId}`, {
        userId: auth?.user?._id,
      });
    } catch (err) {
      console.error("SeenBy error:", err.message);
    }
  };

  const debouncedMarkSeen = debounce((messages) => {
    messages.forEach((msg) => markSeen(msg._id));
  }, 1500);

  useEffect(() => {
    if (!auth?.user?._id || !chatMessages.length) return;

    const unseen = chatMessages.filter(
      (m) => m?._id && !m.seenBy?.includes(auth.user._id)
    );

    if (unseen.length) debouncedMarkSeen(unseen);
  }, [chatMessages, auth?.user?._id]);

  // ====================================================================================
  // ✅ SOCKET REALTIME — Reliable for All Roles
  // ====================================================================================
  useEffect(() => {
    if (!socket) return;

    const onGroupChatMessage = (msg) => {
      console.log("📨 Received realtime message:", msg);
      const normalized = {
        ...msg,
        senderId:
          msg?.senderId && typeof msg.senderId === "object"
            ? msg.senderId._id || msg.senderId
            : msg.senderId,
        senderName:
          msg.senderName ||
          (msg.senderId && msg.senderId.userName) ||
          "Unknown",
        taggedAgent:
          msg.taggedAgent && typeof msg.taggedAgent === "object"
            ? msg.taggedAgent
            : msg.taggedAgent || null,
        seenBy: msg.seenBy || [],
      };

      setChatMessages((prev) => {
        if (
          prev.some(
            (m) =>
              m.timestamp === normalized.timestamp && m.text === normalized.text
          )
        )
          return prev;
        return [...prev, normalized];
      });

      // ✅ Clear booking preview globally
      if (msg.clearBookingPreview) {
        setBookingPreview("");
        localStorage.removeItem("bookingPreview");
      }

      if (String(normalized.senderId) !== String(auth?.user?._id)) {
        toast(`New message from ${normalized.senderName}`);
        if (!showChat) setUnreadCount((prev) => prev + 1);
      }
    };

    socket.on("groupChatMessage", onGroupChatMessage);

    const onClearBookingPreview = () => {
      setBookingPreview("");
      localStorage.removeItem("bookingPreview");
    };
    socket.on("clearBookingPreview", onClearBookingPreview);

    return () => {
      socket.off("groupChatMessage", onGroupChatMessage);
      socket.off("clearBookingPreview", onClearBookingPreview);
    };
  }, [socket, auth?.user?._id, showChat]);

  // ====================================================================================
  // ✅ AUTO SCROLL
  // ====================================================================================
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatMessages]);

  // ====================================================================================
  // ✅ SEND MESSAGE — Fix Preview Clearing
  // ====================================================================================
  const sendMessage = async () => {
    const finalText = `${
      bookingPreview ? bookingPreview + "\n" : ""
    }${chatInput.trim()}`;
    if (!finalText.trim()) return;

    const msg = {
      text: finalText,
      senderId: auth?.user?._id,
      senderName: auth?.user?.userName,
      taggedAgent,
      timestamp: Date.now(),
    };

    socket.emit("groupChatMessage", msg);

    setChatInput("");
    setTaggedAgent("");

    // ✅ Clear preview locally + notify all users
    setBookingPreview("");
    if (location.state?.bookingText) {
      window.history.replaceState({}, document.title, location.pathname);
    }
    socket.emit("clearBookingPreview", { by: auth?.user?._id });
  };

  // ====================================================================================
  // ✅ UI
  // ====================================================================================
  return (
    <>
      <button
        className="btn btn-success position-fixed"
        style={{ bottom: "20px", right: "20px", zIndex: 1000 }}
        onClick={() => {
          setShowChat(true);
          setUnreadCount(0);
        }}
      >
        Chat with us
        {unreadCount && unreadCount > 0 && (
          <span className="badge bg-danger ms-2">{unreadCount}</span>
        )}
      </button>

      {showChat && (
        <div
          className="modal fade show"
          style={{
            width: "100%",
            backgroundColor: "rgba(0,0,0,0.5)",
            zIndex: 2000,
            position: "fixed",
            top: 0,
            right: auth?.user ? 0 : "auto",
            left: auth?.user ? "auto" : 0,
            height: "100vh",
            justifyContent: auth?.user ? "flex-end" : "flex-start",
            display: "flex",
          }}
        >
          <div className="modal-dialog modal-lg" style={{ marginTop: "5vh" }}>
            <div className="modal-content rounded shadow">
              <div className="modal-header">
                <h5 className="modal-title text-success">Agent Group Chat</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowChat(false)}
                ></button>
              </div>

              <div
                className="modal-body"
                style={{ maxHeight: "60vh", overflowY: "auto" }}
              >
                {chatMessages.length === 0 ? (
                  <p className="text-muted">No messages yet.</p>
                ) : (
                  <>
                    {chatMessages.map((msg, idx) => {
                      const senderId =
                        typeof msg.senderId === "object"
                          ? msg.senderId?._id
                          : msg.senderId;

                      const isCurrentUser =
                        String(senderId) === String(auth?.user?._id);

                      const taggedId =
                        msg.taggedAgent && typeof msg.taggedAgent === "object"
                          ? msg.taggedAgent._id
                          : msg.taggedAgent;

                      const role = auth?.user?.role?.toLowerCase();

                      const visible =
                        !taggedId ||
                        role === "admin" ||
                        role === "superadmin" ||
                        String(taggedId) === String(auth?.user?._id) ||
                        String(senderId) === String(auth?.user?._id);

                      if (!visible) return null;

                      return (
                        <div key={idx}>
                          <div
                            className={`mb-2 d-flex ${
                              isCurrentUser
                                ? "justify-content-end"
                                : "justify-content-start"
                            }`}
                          >
                            <div
                              className={`p-2 rounded shadow-sm ${
                                isCurrentUser
                                  ? "bg-success text-white"
                                  : "bg-light"
                              } max-w-75`}
                              style={{ minWidth: "200px", maxWidth: "75%" }}
                            >
                              <span
                                className={`fw-bold ${
                                  isCurrentUser ? "text-white" : "text-primary"
                                }`}
                              >
                                {msg.senderName}
                              </span>

                              {msg.taggedAgent && (
                                <div className="mt-1">
                                  <span
                                    className={`badge me-1 ${
                                      isCurrentUser
                                        ? "bg-light text-success"
                                        : "bg-info"
                                    }`}
                                  >
                                    @
                                    {msg.taggedAgent.userName ||
                                      msg.taggedAgent}
                                  </span>
                                </div>
                              )}

                              <div className="mt-1">
                                {msg.text.split(/\s+/).map((word, i) =>
                                  word.startsWith("@") ? (
                                    <span
                                      key={i}
                                      className="badge bg-primary me-1"
                                    >
                                      {word}
                                    </span>
                                  ) : (
                                    word + " "
                                  )
                                )}
                              </div>

                              <small
                                className={`text-muted d-block mt-1 ${
                                  isCurrentUser ? "text-white-50" : ""
                                }`}
                              >
                                {new Date(msg.timestamp).toLocaleString()}
                              </small>
                            </div>

                            <div className="position-relative">
                              <div
                                className="cursor-pointer"
                                onClick={() => handleSeenListToggle(msg, idx)}
                              >
                                <HiOutlineDotsVertical />
                              </div>

                              {openSeenList === idx && (
                                <>
                                  <div
                                    ref={popupRef}
                                    className="position-absolute bg-light border rounded shadow-sm p-2"
                                    style={{
                                      top: "25px",
                                      right: 0,
                                      minWidth: "150px",
                                      zIndex: 10,
                                    }}
                                  >
                                    <strong className="d-block mb-1">
                                      Seen by:
                                    </strong>
                                    {seenByList.length > 0 ? (
                                      seenByList.map((user, i) => (
                                        <div
                                          key={i}
                                          className="small text-dark"
                                        >
                                          {user.userName || user}
                                        </div>
                                      ))
                                    ) : (
                                      <div className="small text-muted">
                                        No one has seen this yet.
                                      </div>
                                    )}
                                  </div>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                    <div ref={chatEndRef} />
                  </>
                )}
              </div>

              <div className="modal-footer d-flex flex-column gap-2">
                {bookingPreview && (
                  <div
                    className="w-100 p-2 mb-2 border rounded bg-light text-dark d-flex align-items-start justify-content-between"
                    style={{ fontSize: "14px", whiteSpace: "pre-wrap" }}
                  >
                    <div style={{ flex: 1 }}>{bookingPreview}</div>
                    <button
                      className="btn btn-sm btn-outline-danger ms-2"
                      title="Remove selected booking"
                      onClick={() => {
                        setBookingPreview("");
                        if (location.state?.bookingText) {
                          window.history.replaceState(
                            {},
                            document.title,
                            location.pathname
                          );
                        }
                        localStorage.removeItem("bookingPreview");
                        socket.emit("clearBookingPreview", {
                          by: auth?.user?._id,
                        });
                      }}
                    >
                      ×
                    </button>
                  </div>
                )}

                <div className="d-flex gap-2 w-100 position-relative">
                  <input
                    type="text"
                    className="form-control p-3"
                    placeholder="Type your message..."
                    value={chatInput}
                    onChange={(e) => {
                      setChatInput(e.target.value);
                      if (e.target.value.endsWith("@")) {
                        setShowSuggestions(true);
                      } else if (!getLastWord(e.target.value).startsWith("@")) {
                        setShowSuggestions(false);
                      }
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") sendMessage();
                    }}
                  />

                  {getLastWord(chatInput).startsWith("@") && (
                    <div
                      className="position-absolute bg-light border rounded shadow-sm"
                      style={{
                        bottom: "45px",
                        left: 0,
                        zIndex: 10,
                        maxHeight: "180px",
                        overflowY: "auto",
                        width: "220px",
                      }}
                    >
                      {showSuggestions &&
                        agent?.map((a) => (
                          <div
                            key={a._id}
                            className="p-2 hover-bg-light"
                            style={{ cursor: "pointer" }}
                            onClick={() => {
                              const words = chatInput.split(/\s+/);
                              words[words.length - 1] = `@${a.userName}`;
                              setChatInput(words.join(" ") + " ");
                              setTaggedAgent(a._id);
                              setShowSuggestions(false);
                            }}
                          >
                            {a.userName}
                          </div>
                        ))}
                    </div>
                  )}

                  <button className="btn btn-success" onClick={sendMessage}>
                    Send
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;
