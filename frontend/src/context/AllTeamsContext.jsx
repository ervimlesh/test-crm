import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";

// Create Context
const AllTeamContext = createContext();

// Custom Hook for accessing context
export const useAllTeams = () => useContext(AllTeamContext);

// Provider Component
export const AllTeamsProvider = ({ children }) => {
  const [agent, setAgent] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorCode, setErrorCode] = useState(null);

  // Fetch trashed agents
  const fetchAdmin = async () => {
    try {
      setLoading(true);
      setErrorCode(null);
      const res = await axios.get("/api/v1/auth/get-all-agents");

      if (res?.data.length === 0) {
        setErrorCode("There are no admins registered.");
      } else {
        // Filter users where isTrashed is true
        // const trashedAgents = res?.data?.data.filter(user => user.isTrashed === false);
        // setAgent(trashedAgents);
         const trashedAgents = res?.data?.data.filter(user => user.isTrashed === false && user.status !== "pending");
        setAgent(trashedAgents);
       
      }
    } catch (error) {
      setErrorCode(error?.response?.status || "Unknown Error");
    } finally {
      setLoading(false);
    }
  };

  // Call fetch on component mount
  useEffect(() => {
    fetchAdmin();
  }, []);

  return (
    <AllTeamContext.Provider value={{ agent, setAgent,fetchAdmin, loading, errorCode }}>
      {children}
    </AllTeamContext.Provider>
  );
};
