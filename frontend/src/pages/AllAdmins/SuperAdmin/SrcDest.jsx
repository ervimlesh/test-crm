import React, { useEffect, useMemo, useState } from "react";
import Layout from "../../../components/Layout/Layout";
import SideBar from "../../../components/SideBar";
import axios from "axios";
import toast from "react-hot-toast";
import { NavLink } from "react-router-dom";

const SrcDest = () => {
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
  const [currentReduction, setCurrentReduction] = useState([]);

  // Handle blur/focus for source input
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

  // Handle blur/focus for destination input
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

  // Handle suggestion click for source
  const handleSuggestionClick = (location) => {
    setKeyword(location);
    setFormData((prev) => ({ ...prev, source: location }));
    setShowSuggestions(false);
  };

  // Handle suggestion click for destination
  const handleSuggestionClick2 = (location) => {
    setDkeyword(location);
    setFormData((prev) => ({ ...prev, destination: location }));
    setShowSuggestionsDest(false);
  };

  // Handle input change for source (with suggestions)
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

  // Handle input change for destination (with suggestions)
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

  // Handle input change for other fields
  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  // Submit form data
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log(formData);
      const response = await axios.patch(
        "/api/v1/flights/reduction-percentage-srcDest/",
        formData
      );
      if (response.data.success) {
        toast.success(response.data.message);
        setFormData({
          source: "",
          destination: "",
          reducePercentage: "",
          reduceUrl: "",
        });
        setKeyword("");
        setDkeyword("");
        fetchCurrentReduction();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error updating reduction percentage:", error);
      // Show backend error message if present
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        toast.error(error.response.data.message);
      } else {
        alert("Failed to update reduction percentage. Please try again.");
      }
    }
  };

  // Fetch current reduction data
  const fetchCurrentReduction = async () => {
    try {
      const response = await axios.get(
        "/api/v1/flights/get-reduction-percentage"
      );
      if (response.data.success) {
        setCurrentReduction(response?.data?.data);
      } else {
        console.error("Failed to fetch current reduction percentage.");
      }
    } catch (error) {
      console.error("Error fetching current reduction percentage:", error);
    }
  };

  useEffect(() => {
    fetchCurrentReduction();
  }, []);

  const handleDelete = async (id) => {
    try {
      const res = await axios.delete(`/api/v1/flights/delete-src-dest/${id}`);

      console.log(res);
      if (res?.data?.success) {
        toast.success(res?.data?.message);
        fetchCurrentReduction();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const reductionUrls = useMemo(() => {
    const urls = currentReduction
      .map((reduction) => reduction?.reduceUrl)
      .filter(Boolean);
    return [...new Set(urls)];
  }, [currentReduction]);

  const getUrlDisplayName = (url) => {
    if (!url) return "Other";
    // Optionally, prettify the URL (remove .com, capitalize, etc.)
    const name = url.replace(".com", "");
    return name.charAt(0).toUpperCase() + name.slice(1);
  };

  return (
    <Layout>
      <div className="d-flex">
        <SideBar />
        <div className="flex-grow-1 p-4">
          <h3 className="text-center">Src-Dest</h3>
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
              Submit
            </button>
          </form>
          <div className="card">
            <div className="d-flex justify-content-between align-items-center p-2 bg-light">
              <h7 className="m-1 p-1 ">Current Discount</h7>
            </div>
            <div className="card-body">
              <div className="table-responsive">
                {reductionUrls.map((url) => (
                  <div key={url} className="mb-4">
                    <h5 className="text-start text-success fw-bold text-uppercase mt-3">
                      {getUrlDisplayName(url)}
                    </h5>
                    <table className="table table-bordered">
                      <thead>
                        <tr>
                          <th>Src-Dest Percentage</th>
                          {/* <th>Reduction Url</th> */}
                          <th>Source</th>
                          <th>Destination</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {currentReduction.filter(
                          (reduction) =>
                            reduction?.reduceSrcDestPercentage &&
                            reduction?.reduceSrc &&
                            reduction?.reduceDest &&
                            reduction?.reduceUrl === url
                        ).length > 0 ? (
                          currentReduction
                            .filter(
                              (reduction) =>
                                reduction?.reduceSrcDestPercentage &&
                                reduction?.reduceSrc &&
                                reduction?.reduceDest &&
                                reduction?.reduceUrl === url
                            )
                            .map((reduction, index) => (
                              <tr key={reduction?._id || index}>
                                <td>
                                  {reduction?.reduceSrcDestPercentage || "-"} %
                                </td>
                                {/* <td>{reduction?.reduceUrl || "-"}</td> */}
                                <td>{reduction?.reduceSrc || "-"}</td>
                                <td>{reduction?.reduceDest || "-"}</td>
                                <td className="d-flex gap-1">
                                  <NavLink
                                    to={`/astrivion/src-dest-details/${reduction?._id}`}
                                    className="btn btn-primary btn-sm"
                                  >
                                    Edit
                                  </NavLink>
                                  <NavLink
                                    className="btn btn-danger btn-sm"
                                    onClick={() => {
                                      handleDelete(reduction?._id);
                                    }}
                                  >
                                    Delete
                                  </NavLink>
                                </td>
                              </tr>
                            ))
                        ) : (
                          <tr>
                            <td colSpan="5" className="text-center">
                              No reduction data for this Reduction Url.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default SrcDest;
