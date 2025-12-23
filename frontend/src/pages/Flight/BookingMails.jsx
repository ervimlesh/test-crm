import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout/Layout.jsx";
import SideBar from "../../components/SideBar.jsx";
import axios from "axios";
import { useLocation } from "react-router-dom";

const BookingMails = () => {
  const [bookingMails, setBookingMails] = useState([]);
  const [originalBookingMails, setOriginalBookingMails] = useState([]);
  const [providers, setProviders] = useState([]);

  //  Filter states
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [selectedProvider, setSelectedProvider] = useState("");

  const location = useLocation();

  //  Parse and decode the URL parameter
  const queryParams = new URLSearchParams(location.search);
  const encodedUrl = queryParams.get("url");
  const url = encodedUrl ? decodeURIComponent(encodedUrl) : null;

  useEffect(() => {
    const fetchProviders = async () => {
      try {
        const res = await axios.get("/api/v1/ctmFlights/get-provider");

        if (res.data.success) setProviders(res.data.booking);
      } catch (error) {
        console.error("Failed to fetch providers", error);
      }
    };

    fetchProviders();
  }, []);

  useEffect(() => {
    const fetchBookingMails = async () => {
      try {
        const res = await axios.get("/api/v1/flights/get-booking-mails");

        if (res.data.success) {
          const allMails = res.data.ctmFlightMails || [];
          setOriginalBookingMails(allMails);

          //  Filter data by decoded URL parameter (if exists)
          if (url) {
            const filteredMails = allMails.filter(
              (mailData) => mailData?.webUrl?.trim() === url.trim()
            );

            setBookingMails(filteredMails);
          } else {
            setBookingMails(allMails);
          }
        } else {
          console.error("Failed to fetch booking mails:", res.data.message);
        }
      } catch (error) {
        console.error("Error fetching booking mails:", error);
      }
    };

    fetchBookingMails();
  }, [url]);

  // const handleButtonClick = async (url, mail) => {
  //   if (!url) {
  //     console.error("URL is undefined");
  //     return;
  //   }

  //   try {
  //     await axios.post("/api/v1/flights/webUrl", {
  //       webUrl: url,
  //       webMail: mail,
  //     });
  //     console.log(" URL sent successfully:", url, mail);
  //   } catch (error) {
  //     if (error.response) {
  //       console.error("Failed to send URL:", error.response.data);
  //     } else {
  //       console.error("Error sending URL:", error.message);
  //     }
  //   }
  // };

  const handleButtonClick = async (url, mail) => {
    if (!url) {
      console.error("URL is undefined");
      return;
    }

    //  Validation Logic for filters
    const isAnyFilterFilled = fromDate || toDate || selectedProvider;
    const isAllFiltersFilled = fromDate && toDate && selectedProvider;

    if (isAnyFilterFilled && !isAllFiltersFilled) {
      alert(
        "Please select From Date, To Date, and Provider before running deals."
      );
      return;
    }

    try {
      const payload = {
        webUrl: url,
        webMail: mail,
      };

      //  Add filters only if all are filled
      if (isAllFiltersFilled) {
        payload.fromDate = fromDate;
        payload.toDate = toDate;
        payload.provider = selectedProvider;
      }

      await axios.post("/api/v1/flights/webUrl", payload);
      console.log(" URL sent successfully:", payload);
    } catch (error) {
      if (error.response) {
        console.error("Failed to send URL:", error.response.data);
      } else {
        console.error("Error sending URL:", error.message);
      }
    }
  };

  //  Get unique URL + Mail pairs
  const uniqueValues = Array.from(
    new Set(
      bookingMails.map((mailData) =>
        JSON.stringify({ url: mailData?.webUrl, mail: mailData?.webMail })
      )
    )
  )
    .map((item) => JSON.parse(item))
    .filter((item) => item.url || item.mail);

  //  Handle Filter Logic
  const handleFilter = () => {
    let filtered = [...originalBookingMails];
    console.log("from is ", fromDate);
    console.log("to is ", toDate);
    console.log("provider is ", selectedProvider);

    // Helper function to check if two dates have the same day, month, and year
    const isSameDate = (d1, d2) => {
      return (
        d1.getDate() === d2.getDate() &&
        d1.getMonth() === d2.getMonth() &&
        d1.getFullYear() === d2.getFullYear()
      );
    };

    if (fromDate) {
      const from = new Date(fromDate);
      filtered = filtered.filter((mail) => {
        const created = new Date(mail.createdAt);
        return isSameDate(created, from);
      });
    }

    if (toDate) {
      const to = new Date(toDate);
      filtered = filtered.filter((mail) => {
        const created = new Date(mail.createdAt);
        return isSameDate(created, to);
      });
    }

    if (selectedProvider) {
      console.log("Selected Provider:", selectedProvider);
      filtered = filtered.filter(
        (mail) =>
          mail?.provider &&
          mail?.provider?.provider
            ?.toLowerCase()
            .includes(selectedProvider.toLowerCase())
      );
    }

    setBookingMails(filtered);
  };

  return (
    <Layout>
      <div className="d-flex">
        <SideBar />
        <div className="flex-grow-1 p-4">
          <h2 className="text-start">Booking Mails</h2>

          {/* ======================= */}
          {/* FILTER SECTION */}
          {/* ======================= */}
          <div className="card p-3 mb-3 shadow-sm">
            <h5 className="text-start mb-3">Filters</h5>
            <div className="row align-items-end">
              <div className="col-md-3">
                <label className="form-label">From Date</label>
                <input
                  type="date"
                  className="form-control"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                />
              </div>
              <div className="col-md-3">
                <label className="form-label">To Date</label>
                <input
                  type="date"
                  className="form-control"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                />
              </div>
              <div className="col-md-3">
                <label className="form-label">Select Provider</label>
                <select
                  className="form-select"
                  value={selectedProvider}
                  onChange={(e) => setSelectedProvider(e.target.value)}
                >
                  <option value="">All Providers</option>
                  {providers
                    .filter((prov) => prov.providerStatus === "Active")
                    .map((prov) => (
                      <option key={prov._id} value={prov.provider}>
                        {prov.provider}
                      </option>
                    ))}
                </select>
              </div>
              <div className="col-md-3 d-flex gap-2">
                <button className="btn btn-primary w-50" onClick={handleFilter}>
                  Apply Filter
                </button>
                <button
                  className="btn btn-secondary w-50"
                  onClick={() => {
                    setFromDate("");
                    setToDate("");
                    setSelectedProvider("");
                    setBookingMails(originalBookingMails);
                  }}
                >
                  Reset
                </button>
              </div>
            </div>
          </div>

          {/* ======================= */}
          {/* SHOW UNIQUE URL + MAILS */}
          {/* ======================= */}
          <div>
            <p className="text-start">Booking URLs and WebMails</p>
            <div>
              {uniqueValues.length > 0 ? (
                <ul className="list-group">
                  {uniqueValues.map((item, index) => (
                    <li key={index} className="list-group-item">
                      {item.url && (
                        <span
                          className="text-primary p-1"
                          style={{
                            background: "none",
                            border: "none",
                            textDecoration: "underline",
                          }}
                        >
                          {item.url}
                        </span>
                      )}
                      {item.mail && (
                        <span
                          className="text-secondary p-1"
                          style={{ marginLeft: "10px" }}
                        >
                          {item.mail}
                        </span>
                      )}

                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => handleButtonClick(item.url, item.mail)}
                      >
                        Run Deals
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No booking URLs or webMails available.</p>
              )}
            </div>
          </div>

          {/* ======================= */}
          {/* FILTER & RELOAD BUTTONS */}
          {/* ======================= */}
          <div className="d-flex justify-content-between align-items-center mb-3 mt-3">
            <div></div>
            <button
              className="btn btn-success"
              onClick={() => setBookingMails(originalBookingMails)}
            >
              Reload All
            </button>
          </div>

          {/* ======================= */}
          {/* TABLE SECTION */}
          {/* ======================= */}
          <table className="table table-striped table-bordered">
            <thead>
              <tr>
                <th>Sr. No</th>
                <th>Mail</th>
                <th>Phone</th>
                <th>Type</th>
                <th>Website</th>
              </tr>
            </thead>
            <tbody>
              {bookingMails.map((mailData, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{mailData?.email}</td>
                  <td>{mailData?.mobile}</td>
                  <td>{mailData?.type}</td>
                  <td>
                    <span className="text-success outline-0 border-0 bg-transparent">
                      {mailData?.webUrl ? mailData?.webUrl : "No URL"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
};

export default BookingMails;
