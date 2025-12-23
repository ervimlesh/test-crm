import React, { useState, useEffect } from "react";
import Layout from "../../components/Layout/Layout.jsx";
import SideBar from "../../components/SideBar.jsx";
import axios from "axios";
import { formatEST } from "../utils/formatUTC.jsx";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { useAuth } from "../../context/Auth.jsx";

const AllVoiceRecord = () => {
  const { auth, setAuth } = useAuth();
  const [allVoice, setAllVoice] = useState([]);
  const [filteredVoice, setFilteredVoice] = useState([]);
  const [agents, setAgents] = useState([]);
  const [selectedAgent, setSelectedAgent] = useState("All");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [selectedBhAd, setSelectedBhAd] = useState("All"); 

  const userRole = auth?.user?.role;
  console.log("upcoming roles is ", userRole);

  useEffect(() => {
    const fetchVoiceRecords = async () => {
      try {
        const response = await axios.get("/api/v1/auth/all-voice-records");
        let data = response?.data?.data || [];

       
        if (userRole === "marketing") {
          data = data.filter((record) => record.bhAd === "AD");
        }
       

        setAllVoice(data);
        setFilteredVoice(data);

        const uniqueAgents = [
          ...new Set(data.map((record) => record.agent?.userName)),
        ];
        setAgents(uniqueAgents);
      } catch (error) {
        console.error("Error fetching voice records:", error);
      }
    };

    fetchVoiceRecords();
  }, [userRole]);

  const filterByAgent = (agentName) => {
    setSelectedAgent(agentName);
    applyFilters(agentName, fromDate, toDate, selectedBhAd);
  };

  
  const applyFilters = (
    agentName = selectedAgent,
    start = fromDate,
    end = toDate,
    bhAdType = selectedBhAd
  ) => {
    let data = [...allVoice];

    if (agentName !== "All") {
      data = data.filter((record) => record.agent?.userName === agentName);
    }
    if (start) {
      data = data.filter(
        (record) => new Date(record.createdAt) >= new Date(start)
      );
    }
    if (end) {
      data = data.filter(
        (record) => new Date(record.createdAt) <= new Date(end)
      );
    }
    if (bhAdType !== "All") {
      data = data.filter((record) => record.bhAd === bhAdType);
    }

    setFilteredVoice(data);
  };

  const clearFilters = () => {
    setSelectedAgent("All");
    setFromDate("");
    setToDate("");
    setSelectedBhAd("All"); 
    setFilteredVoice(allVoice);
  };

  const downloadExcel = () => {
    const formattedData = filteredVoice.map((record, index) => ({
      "S.No": index + 1,
      Date: new Date(record.date).toLocaleDateString(),
      Agent: record.agent?.userName || "Unknown",
      "TFN No": record.tfnNo,
      "Customer No": record.customerNo,
      Airline: record.airline,
      "BH/AD": record.bhAd,
      Language: record.language,
      Conversion: record.conversion,
      Query: record.query,
      "Created At": formatEST(record.createdAt),
    }));

    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Voice Records");

    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const fileData = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    saveAs(fileData, "Voice_Records.xlsx");
  };

  return (
    <Layout>
      <main className="crm_all_body d-flex">
        <SideBar />
        <div className="crm_right relative p-4">
          <h2 className="mb-3">Voice Record</h2>

          <button onClick={downloadExcel} className="btn btn-success mb-3">
            Download Excel
          </button>

          {/*  Filter Section */}
          <div className="d-flex flex-wrap mb-3 align-items-center">
            <label className="me-2">From:</label>
            <input
              type="date"
              className="form-control me-2"
              value={fromDate}
              onChange={(e) => {
                setFromDate(e.target.value);
                applyFilters(selectedAgent, e.target.value, toDate, selectedBhAd);
              }}
            />

            <label className="me-2">To:</label>
            <input
              type="date"
              className="form-control me-2"
              value={toDate}
              onChange={(e) => {
                setToDate(e.target.value);
                applyFilters(selectedAgent, fromDate, e.target.value, selectedBhAd);
              }}
            />

            {/*  Show BH/AD select box only for superadmin */}
            {userRole === "superadmin" && (
              <>
                <label className="me-2">BH/AD:</label>
                <select
                  className="form-control me-2"
                  value={selectedBhAd}
                  onChange={(e) => {
                    setSelectedBhAd(e.target.value);
                    applyFilters(selectedAgent, fromDate, toDate, e.target.value);
                  }}
                >
                  <option value="All">All</option>
                  <option value="BH">BH</option>
                  <option value="AD">AD</option>
                </select>
              </>
            )}

            <button className="btn btn-warning" onClick={clearFilters}>
              Clear Filters
            </button>
          </div>

          {/*  Agent Filter Buttons */}
          <div className="mb-3">
            <button
              onClick={() => filterByAgent("All")}
              className={`btn me-2 ${
                selectedAgent === "All" ? "btn-primary" : "btn-outline-primary"
              }`}
            >
              All
            </button>
            {agents.map((name, index) => (
              <button
                key={index}
                onClick={() => filterByAgent(name)}
                className={`btn me-2 ${
                  selectedAgent === name ? "btn-primary" : "btn-outline-primary"
                }`}
              >
                {name}
              </button>
            ))}
          </div>

          {/*  Table */}
          <div className="table-responsive">
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th>S.No</th>
                  <th>Date</th>
                  <th>Agent</th>
                  <th>TFN No</th>
                  <th>Customer No</th>
                  <th>Airline</th>
                  <th>BH/AD</th>
                  <th>Language</th>
                  <th>Conversion</th>
                  <th>Query</th>
                  <th>Created At</th>
                </tr>
              </thead>
              <tbody>
                {filteredVoice.map((record, idx) => (
                  <tr key={record._id}>
                    <td>{idx + 1}</td>
                    <td>{new Date(record.date).toLocaleDateString()}</td>
                    <td>{record.agent?.userName || "Unknown"}</td>
                    <td>{record.tfnNo}</td>
                    <td>{record.customerNo}</td>
                    <td>{record.airline}</td>
                    <td>{record.bhAd}</td>
                    <td>{record.language}</td>
                    <td>{record.conversion}</td>
                    <td>{record.query}</td>
                    <td>{formatEST(record.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </Layout>
  );
};

export default AllVoiceRecord;
