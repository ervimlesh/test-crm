import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";


const HotelDealsContext = createContext();
export const useHotelDeals = () => useContext(HotelDealsContext);

export const HotelDealsProvider = ({ children }) => {
    const [hotelDeals, setHotelDeals] = useState([]);
    const [loading, setLoading] = useState(false);
    const [errorCode, setErrorCode] = useState(null);
    
    const fetchHotelDeals = async () => {
        try {
        
        setLoading(true);
        setErrorCode(null);
        const { data } = await axios.get("/api/v1/hotels/get-hotels");
       
        if (data?.data.length === 0) {
            setErrorCode("There are no deals available for now.");
        } else {
            setHotelDeals(data?.data);
            ;
        }
        } catch (error) {
        setErrorCode(error?.response?.status);
        } finally {
        setLoading(false);
        }
    };
    
    useEffect(() => {
        fetchHotelDeals();
    }, []);
    
    return (
        <HotelDealsContext.Provider value={{ hotelDeals,setHotelDeals, loading, errorCode, fetchHotelDeals }}>
        {children}
        </HotelDealsContext.Provider>
    );
    }