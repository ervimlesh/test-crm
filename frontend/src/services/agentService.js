import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api/v1";

/**
 * Fetch list of all active agents
 * @returns {Promise<Array>} Array of agent objects with _id, userName, email, role
 */
export const getActiveAgents = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/management/agents`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return response.data?.data || [];
  } catch (error) {
    console.error("Error fetching active agents:", error);
    return [];
  }
};

/**
 * Fetch a single agent by ID
 * @param {string} agentId - Agent ID to fetch
 * @returns {Promise<Object>} Agent object
 */
export const getAgentById = async (agentId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/management/agents/${agentId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return response.data?.data || null;
  } catch (error) {
    console.error(`Error fetching agent ${agentId}:`, error);
    return null;
  }
};

/**
 * Get online agents (agents currently available for screen sharing)
 * @returns {Promise<Array>} Array of online agents
 */
export const getOnlineAgents = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/management/agents/online`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return response.data?.data || [];
  } catch (error) {
    console.error("Error fetching online agents:", error);
    return [];
  }
};
