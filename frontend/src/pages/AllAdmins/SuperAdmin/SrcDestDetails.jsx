import React, { useEffect, useState } from "react";
import Layout from "../../../components/Layout/Layout";
import SideBar from "../../../components/SideBar";
import axios from "axios";
import toast from "react-hot-toast";
import { useParams, useNavigate } from "react-router-dom";

const SrcDestDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [keyword, setKeyword] = useState("");
  const [dkeyword, setDkeyword] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showSuggestionsDest, setShowSuggestionsDest] = useState(false);
  const [destinations, setDestinations] = useState([]);
  const [locations, setLocations] = useState([]);
  const [formData, setFormData] = useState({
    source: "",
    destination: "",
    reducePercentage: "",
    reduceUrl: "",
  });
  const [loading, setLoading] = useState(true);

  // Fetch reduction data by ID
  useEffect(() => {
    const fetchReduction = async () => {
      try {
        const res = await axios.get(`/api/v1/flights/detail-reduce-reduction-percentage/${id}`);
        if (res.data.success && res.data.data) {
          const data = res.data.data;
          setFormData({
            source: data.reduceSrc || "",
            destination: data.reduceDest || "",
            reducePercentage: data.reduceSrcDestPercentage || "",
            reduceUrl: data.reduceUrl || "",
          });
          setKeyword(data.reduceSrc || "");
          setDkeyword(data.reduceDest || "");
        } else {
          toast.error("Failed to fetch reduction data.");
        }
      } catch (err) {
        console.log(err);
        toast.error("Error fetching reduction data.");
      } finally {
        setLoading(false);
      }
    };
    fetchReduction();
  }, [id]);

  // Source input handlers
  const handleInputBlur = () => {
    const isValid = locations.some((location) => location === keyword);
    if (!isValid && locations.length > 0) {
      setKeyword(locations[0]);
      setFormData((prev) => ({ ...prev, source: locations[0] }));
    }
    setShowSuggestions(false);
  };

  const handleInputFocus = () => {
    setKeyword("");
    setLocations([]);
    setShowSuggestions(false);
  };

  // Destination input handlers
  const handleInputBlur2 = () => {
    const isValid = destinations.some((location) => location === dkeyword);
    if (!isValid && destinations.length > 0) {
      setDkeyword(destinations[0]);
      setFormData((prev) => ({ ...prev, destination: destinations[0] }));
    }
    setShowSuggestionsDest(false);
  };

  const handleInputFocus2 = () => {
    setDkeyword("");
    setDestinations([]);
    setShowSuggestionsDest(false);
  };

  // Suggestion click handlers
  const handleSuggestionClick = (location) => {
    setKeyword(location);
    setFormData((prev) => ({ ...prev, source: location }));
    setShowSuggestions(false);
  };

  const handleSuggestionClick2 = (location) => {
    setDkeyword(location);
    setFormData((prev) => ({ ...prev, destination: location }));
    setShowSuggestionsDest(false);
  };

  // Input change handlers
  const handleSourceInputChange = async (e) => {
    const value = e.target.value;
    setKeyword(value);
    setFormData((prev) => ({ ...prev, source: value }));
    if (value.length >= 1) {
      try {
        const response = await axios.get(
          `/api/v1/flights/locations?keyword=${value}`
        );
        setLocations(response.data);
        setShowSuggestions(true);
      } catch (error) {
        console.error("Error fetching locations:", error);
      }
    } else {
      setShowSuggestions(false);
    }
  };

  const handleDestinationInputChange = async (e) => {
    const value = e.target.value;
    setDkeyword(value);
    setFormData((prev) => ({ ...prev, destination: value }));
    if (value.length >= 1) {
      try {
        const response = await axios.get(
          `/api/v1/flights/locations?keyword=${value}`
        );
        setDestinations(response.data);
        setShowSuggestionsDest(true);
      } catch (error) {
        console.error("Error fetching locations:", error);
      }
    } else {
      setShowSuggestionsDest(false);
    }
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  // Submit updated data
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        reduceSrc: formData.source,
        reduceDest: formData.destination,
        reduceSrcDestPercentage: formData.reducePercentage,
        reduceUrl: formData.reduceUrl,
      };
      const response = await axios.patch(
        `/api/v1/flights/reduction-percentage-srcDest-update/${id}`,
        payload
      );
      if (response.data.success) {
        toast.success(response.data.message );
        navigate(-1); // Go back to previous page
      } else {
        toast.error(response.data.message || "Update failed");
      }
    } catch (error) {
      console.log(error)
      toast.error("Failed to update. Please try again.");
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="d-flex">
          <SideBar />
          <div className="flex-grow-1 p-4">
            <div className="card">
              <div className="card-body">Loading...</div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="d-flex">
        <SideBar />
        <div className="flex-grow-1 p-4">
          <div className="card">
            <div className="card-body">
              <h2 className="text-center">Edit Source & Dest</h2>
              <form onSubmit={handleSubmit} className="form_booking">
                <div className="form_booking">
                  <div className="form_holdd text-start relative">
                    <label htmlFor="source">Source</label>
                    <input
                      type="text"
                      id="source"
                      onChange={handleSourceInputChange}
                      value={keyword}
                      onBlur={handleInputBlur}
                      onFocus={handleInputFocus}
                      className="form-control"
                      required
                      placeholder="Search airports"
                    />
                    <div className="listing_airport_ul">
                      {showSuggestions && (
                        <ul className="autoSugge-ul">
                          {locations.map((location) => (
                            <li
                              key={location}
                              className="autoSuggestData cursor-pointer"
                              onClick={() => handleSuggestionClick(location)}
                            >
                              <span className="listing_airport_icon">
                                <img src="/imgs/airline-img.png" alt="" />
                              </span>
                              <span>{location}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>

                  <div className="form_holdd text-start relative">
                    <label htmlFor="destination">Dest</label>
                    <input
                      type="text"
                      id="destination"
                      onChange={handleDestinationInputChange}
                      value={dkeyword}
                      onBlur={handleInputBlur2}
                      onFocus={handleInputFocus2}
                      className="form-control"
                      required
                      placeholder="Search airports"
                    />
                    <div className="listing_airport_ul">
                      {showSuggestionsDest && (
                        <ul className="autoSugge-ul">
                          {destinations.map((location) => (
                            <li
                              key={location}
                              className="autoSuggestData cursor-pointer"
                              onClick={() => handleSuggestionClick2(location)}
                            >
                              <span className="listing_airport_icon">
                                <img src="/imgs/airline-img.png" alt="" />
                              </span>
                              <span>{location}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>

                  <label htmlFor="reducePercentage">
                    Discount <span>*</span>
                  </label>
                  <div className="form_input">
                    <input
                      type="number"
                      maxLength="3"
                      id="reducePercentage"
                      value={formData.reducePercentage}
                      onChange={handleInputChange}
                      required
                      placeholder="Enter reduction percentage"
                      className="form-control"
                      min="0"
                      max="100"
                    />
                  </div>

                  <div className="col-md-9 mb-3">
                    <label htmlFor="reduceUrl" className="form-label">
                      Reduce Url
                    </label>
                    <select
                      id="reduceUrl"
                      className="form-select"
                      value={formData.reduceUrl}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Select</option>
                      <option value="faresway.com">Faresway</option>
                      <option value="traveloways.com">Traveloways</option>
                      <option value="faresvilla.com">Faresvilla</option>
                    </select>
                  </div>
                </div>
                <button type="submit" className="btn btn-primary">
                  Update
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default SrcDestDetails;