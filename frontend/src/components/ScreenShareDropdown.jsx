import React, { useState, useEffect } from "react";
import "./ScreenShareDropdown.css";
import { getSocket } from "../../socket";

/**
 * ScreenShareDropdown Component
 * Displays a dropdown to select agents and automatically initiates screen sharing
 * 
 * Props:
 * - onAgentSelected: Callback when agent is selected (receives agentId, agentName)
 * - onScreenShareStarted: Callback when screen share starts
 * - selectedAgents: Array of currently selected agent IDs
 * - remoteStreams: Object mapping socketId to stream data
 */
const ScreenShareDropdown = ({ 
  onAgentSelected, 
  onScreenShareStarted,
  selectedAgents = [],
  remoteStreams = {}
}) => {
  const socket = getSocket();
  const [agents, setAgents] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentUserId, setCurrentUserId] = useState(null);

  useEffect(() => {
    // Get current user ID from localStorage
    try {
      const authRaw = localStorage.getItem("auth");
      const auth = authRaw ? JSON.parse(authRaw) : null;
      setCurrentUserId(auth?.user?._id || null);
    } catch (error) {
      console.error("Error parsing auth:", error);
    }
  }, []);

  useEffect(() => {
    if (!socket) return;

    // Request agents list on component mount
    socket.emit("get-agents-list");

    // Listen for agents list updates
    const handleAgentsList = ({ agents }) => {
      setAgents(agents || []);
    };

    const handleAgentsListUpdated = ({ agents }) => {
      setAgents(agents || []);
    };

    socket.on("agents-list", handleAgentsList);
    socket.on("agents-list-updated", handleAgentsListUpdated);

    // Periodically refresh agents list
    const interval = setInterval(() => {
      socket.emit("get-agents-list");
    }, 5000);

    return () => {
      socket.off("agents-list", handleAgentsList);
      socket.off("agents-list-updated", handleAgentsListUpdated);
      clearInterval(interval);
    };
  }, [socket]);

  const handleSelectAgent = (agent) => {
    setIsLoading(true);
    
    // Check if agent is already selected
    if (selectedAgents.includes(agent._id)) {
      setIsLoading(false);
      return;
    }

    // ✅ FIXED: Add deduplication to prevent duplicate requests
    if (!window.pendingScreenShareRequests) {
      window.pendingScreenShareRequests = new Set();
    }
    
    const requestKey = agent._id;
    if (window.pendingScreenShareRequests.has(requestKey)) {
      console.warn(`[ScreenShareDropdown] Request already pending for agent ${agent._id}`);
      setIsLoading(false);
      return;
    }
    
    window.pendingScreenShareRequests.add(requestKey);
    // Clear after 2s to allow retry
    setTimeout(() => window.pendingScreenShareRequests.delete(requestKey), 2000);

    // Trigger screen share request
    socket?.emit("request-view", {
      agentId: agent._id,
      reason: "admin-screen-share",
    });

    // Call callback
    onAgentSelected?.(agent._id, agent.userName);
    onScreenShareStarted?.(agent._id);

    // Reset UI
    setSearchTerm("");
    setIsOpen(false);
    setIsLoading(false);
  };

  const filteredAgents = agents.filter(
    (agent) =>
      !selectedAgents.includes(agent._id) &&
      (agent.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        agent.email?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Get current user agent info
  const currentAgent = agents.find((a) => a._id === currentUserId);
  const displayAgents = currentAgent 
    ? [currentAgent, ...filteredAgents.filter(a => a._id !== currentUserId)]
    : filteredAgents;

  return (
    <div className="screen-share-dropdown-container">
      <div className="dropdown-wrapper">
        <button
          className="dropdown-toggle"
          onClick={() => setIsOpen(!isOpen)}
          disabled={isLoading}
        >
          <span className="dropdown-icon">👥</span>
          <span className="dropdown-text">
            {selectedAgents.length > 0
              ? `${selectedAgents.length} agent(s) selected`
              : "Select Agent"}
          </span>
          <span className={`chevron ${isOpen ? "open" : ""}`}>▼</span>
        </button>

        {isOpen && (
          <div className="dropdown-menu">
            <div className="dropdown-search">
              <input
                type="text"
                placeholder="Search agent name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>

            <div className="dropdown-content">
              {isLoading ? (
                <div className="loading-state">Loading agents...</div>
              ) : displayAgents.length > 0 ? (
                <ul className="agents-list">
                  {displayAgents.map((agent) => (
                    <li
                      key={agent._id}
                      className={`agent-item ${agent._id === currentUserId ? "current-user" : ""}`}
                      onClick={() => handleSelectAgent(agent)}
                    >
                      <div className="agent-info">
                        <div className="agent-name">
                          {agent.userName}
                          {agent._id === currentUserId && <span className="current-badge"> (You)</span>}
                        </div>
                        <div className="agent-email">{agent.email}</div>
                      </div>
                      <div className={`agent-status ${agent.isOnline ? "online" : "offline"}`}>
                        <span className="status-dot"></span>
                        {agent.isOnline ? "Online" : "Offline"}
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="empty-state">
                  {agents.length === 0 ? "No agents available" : "No matching agents"}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Display selected agents */}
      {selectedAgents.length > 0 && (
        <div className="selected-agents">
          <h4>Selected Agents ({selectedAgents.length})</h4>
          <div className="agents-grid">
            {selectedAgents.map((agentId) => {
              const agent = agents.find((a) => a._id === agentId);
              const isSharing = !!remoteStreams[agentId];
              
              return (
                <div key={agentId} className="agent-card">
                  <div className="agent-card-header">
                    <span className="agent-card-name">{agent?.userName || agentId}</span>
                    <span className={`sharing-badge ${isSharing ? "active" : "pending"}`}>
                      {isSharing ? "🔴 Sharing" : "⏳ Waiting"}
                    </span>
                  </div>
                  <div className="agent-card-email">{agent?.email}</div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default ScreenShareDropdown;
