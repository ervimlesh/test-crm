import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
 
const CtmFlightDealsContext = createContext();
 
export const useCtmFlightDeals = () => useContext(CtmFlightDealsContext);
 
export const CtmFlightDealsProvider = ({ children }) => {
  const [ctmFlightDeals, setCtmFlightDeals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorCode, setErrorCode] = useState(null);
 
  const data = localStorage.getItem("auth");
  const parsedData = JSON.parse(data);
 
  const fetchCtmFlightDeals = async () => {
    try {
      setLoading(true);
      setErrorCode(null);
      const res = await axios.get("/api/v1/ctmFlights/get-ctm-pnr", {
        headers: {
          authorization: parsedData.token,
        },
      });
 
      if (res?.data?.ctmPnr.length === 0) {
        setErrorCode("There is no Deals available for now.");
      } else {
        setCtmFlightDeals(res?.data?.ctmPnr);
        // console.log("now working",res?.data?.ctmPnr )
      }
      setLoading(false);
    } catch (error) {
      setErrorCode(error?.response?.status);
    } finally {
      setLoading(false);
    }
  };
 
  useEffect(() => {
    fetchCtmFlightDeals();
  }, []);
 
  return (
    <CtmFlightDealsContext.Provider
      value={{
        ctmFlightDeals,
        loading,
        setLoading,
        errorCode,
        fetchCtmFlightDeals,
        setCtmFlightDeals,
      }}
    >
      {children}
    </CtmFlightDealsContext.Provider>
  );
};