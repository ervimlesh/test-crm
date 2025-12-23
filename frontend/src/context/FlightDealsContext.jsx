import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";


const FlightDealsContext = createContext();

export const useFlightDeals = ()=> useContext(FlightDealsContext);

export const FlightDealsProvider = ({children}) =>{
    
    const [flightDeals, setFlightDeals] = useState([]);
    const [loading, setLoading] = useState(false);
    const  [errorCode, setErrorCode] = useState(null);


    const fetchFlightDeals = async()=>{

        try{
            
            setLoading(true);
            setErrorCode(null);
            const { data } = await axios.get("/api/v1/flights/get-flight");
                //     setFlightDeals(data?.data || []);
          
            if(data?.data.length === 0){
                setErrorCode("There is no Deals available for now.");
            }
            else{
                setFlightDeals(data?.data);
                 
            }
            setLoading(false);

        }
        catch(error){
            setErrorCode(error?.response?.status);
        }
        finally{
            setLoading(false);
        }
    }
      useEffect(() => {
        fetchFlightDeals();
      }, []);

    return (
        <FlightDealsContext.Provider value={{flightDeals, loading, setLoading, errorCode, fetchFlightDeals, setFlightDeals}} >
           {children}
        </FlightDealsContext.Provider>
    )
}