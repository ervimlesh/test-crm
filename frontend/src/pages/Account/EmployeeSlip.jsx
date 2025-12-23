import React, { useState, useMemo, useEffect } from "react";
import axios from "axios";
import Layout from "../../components/Layout/Layout";
import SideBar from "../../components/SideBar";
import "./EmployeeSlip.css";
import { useLocation } from "react-router-dom";

const defaultData = {
  companyName: "Astrivion Venture Pvt. Ltd.",
  companyAddress: "123, Khasara road, City, State - 400001",
  payPeriod: "August 2025",
  payDate: "2025-08-31",
  slipNo: "SLIP-2025-08-001",

  // Employee info
  empId: "",
  empName: "",
  designation: "",
  department: "",
  pan: "",
  uan: "",
  pfNo: "",
  esicNo: "",

  // Bank / Payment
  bankName: "",
  accountNo: "",
  ifsc: "",
  paymentMode: "",

  // Attendance
  daysInMonth: 31,
  daysPresent: 26,
  leaves: 0,
  paidLeaves: 0,
  overtimeHours: 0,

  // Earnings
  basic: 0,
  hra: 0,
  conveyance: 0,
  medical: 0,
  specialAllowance: 0,
  bonus: 0,
  otherEarnings: 0,

  // Deductions
  pf: 0,
  professionalTax: 0,
  incomeTax: 0,
  esic: 0,
  otherDeductions: 0,

  penalties: 0,
  approvedBy: "",

  notes: "This is a system generated salary slip.",
  employeeEmail: "",
};

export default function EmployeeSlip() {
  const [data, setData] = useState(defaultData);
  const [sending, setSending] = useState(false);

  const location = useLocation();

  useEffect(() => {
    if (location.state) {
      const state = location.state;
      console.log("location state is ", state);
      // Extract from document[0] if exists
      const doc = state?.employee?.document?.[state?.employee?.document?.length - 1] || {};

      console.log("doc is ", doc);

      setData((prev) => ({
        ...prev,
        ...doc, // merge slip fields (basic, hra, pf, etc.)
        empId: doc.empId || prev.empId,
        empName: state?.employee.userName || prev.empName,
        employeeEmail: state?.employee.email || prev.employeeEmail,
        designation: doc.designation || prev.designation,
        department: doc.department || prev.department,
        pan: doc.pan || prev.pan,
        uan: doc.uan || prev.uan,
        pfNo: doc.pfNo || prev.pfNo,


        accountNo : doc.accountNo || prev.accountNo,
        bankName : doc.bankName || prev.bankName,


        esicNo: doc.esic || prev.esicNo,
        ifsc: doc.ifsc || prev.ifsc,
        payDate: doc.payDate || prev.payDate,
        payPeriod: doc.payPeriod || prev.payPeriod,
        slipNo: doc.slipNo || prev.slipNo,
        paymentMode: doc.paymentMode || prev.paymentMode,
        penalties: state?.employee?.penalties || prev.penalties,
        approvedBy: state?.employee?.approvedBy || prev.approvedBy,
      }));
    }
  }, [location.state]);

  const totals = useMemo(() => {
    const earnings =
      Number(data.basic || 0) +
      Number(data.hra || 0) +
      Number(data.conveyance || 0) +
      Number(data.medical || 0) +
      Number(data.specialAllowance || 0) +
      Number(data.bonus || 0) +
      Number(data.otherEarnings || 0);

    const deductions =
      Number(data.pf || 0) +
      Number(data.professionalTax || 0) +
      Number(data.incomeTax || 0) +
      Number(data.esic || 0) +
      Number(data.otherDeductions || 0) +
      Number(data.penalties || 0);

    const net = earnings - deductions;
    return { earnings, deductions, net };
  }, [data]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const numericFields = [
      "daysInMonth",
      "daysPresent",
      "leaves",
      "paidLeaves",
      "overtimeHours",
      "basic",
      "hra",
      "conveyance",
      "medical",
      "specialAllowance",
      "bonus",
      "otherEarnings",
      "pf",
      "professionalTax",
      "incomeTax",
      "esic",
      "otherDeductions",
      "penalties",
    ];
    setData((d) => ({
      ...d,
      [name]: numericFields.includes(name)
        ? value === ""
          ? ""
          : Number(value)
        : value,
    }));
  };

  const handleSendMail = async () => {
    setSending(true);
    try {
      const res = await axios.post("/api/v1/management/account-slip", { data });
      alert(res.data?.message || "Mail sent");
    } catch (err) {
      console.error(err);
      alert("Failed to send mail — check server logs and env config.");
    } finally {
      setSending(false);
    }
  };

  const handleSavePdf = async () => {
    try {
      const resp = await axios.post(
        `/api/v1/management/account-pdf`,
        { data },
        { responseType: "blob" }
      );
      const blob = new Blob([resp.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${data.empName || "salary"}-slip.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (e) {
      console.error(e);
      alert("Could not download PDF");
    }
  };

  return (
    <Layout>
      <div className="d-flex employee-slip-page">
        <SideBar />
        <div className="flex-grow-1 p-4">
          <div className="slip-card card p-4">
            {/* Header */}
            <div className="d-flex justify-content-between align-items-start">
              <div>
                <div className="form-group">
                  <label>Company Name</label>
                  <input
                    name="companyName"
                    value={data.companyName}
                    onChange={handleChange}
                    className="form-control"
                  />
                </div>
                <div className="form-group mt-2">
                  <label>Company Address</label>
                  <input
                    name="companyAddress"
                    value={data.companyAddress}
                    onChange={handleChange}
                    className="form-control"
                  />
                </div>
              </div>

              <div className="text-end">
                <div>
                  Pay Period:{" "}
                  <input
                    name="payPeriod"
                    value={data.payPeriod}
                    onChange={handleChange}
                    className="form-control form-control-sm d-inline w-auto"
                  />
                </div>
                <div>
                  Pay Date:{" "}
                  <input
                    name="payDate"
                    value={data.payDate}
                    onChange={handleChange}
                    className="form-control form-control-sm d-inline w-auto"
                  />
                </div>
                <div>
                  Slip No:{" "}
                  <input
                    name="slipNo"
                    value={data.slipNo}
                    onChange={handleChange}
                    className="form-control form-control-sm d-inline w-auto"
                  />
                </div>
              </div>
            </div>

            <hr />

            {/* Employee Section */}
            <div className="row">
              <div className="col-md-6">
                <h6>Employee Details</h6>
                <div className="form-group">
                  <label>Name</label>
                  <input
                    name="empName"
                    value={data.empName}
                    onChange={handleChange}
                    className="form-control"
                  />
                </div>
                <div className="form-group">
                  <label>Employee ID</label>
                  <input
                    name="empId"
                    value={data.empId}
                    onChange={handleChange}
                    className="form-control"
                  />
                </div>
                <div className="form-group">
                  <label>Designation</label>
                  <input
                    name="designation"
                    value={data.designation}
                    onChange={handleChange}
                    className="form-control"
                  />
                </div>
                <div className="form-group">
                  <label>Department</label>
                  <input
                    name="department"
                    value={data.department}
                    onChange={handleChange}
                    className="form-control"
                  />
                </div>
                <div className="form-group">
                  <label>PAN</label>
                  <input
                    name="pan"
                    value={data.pan}
                    onChange={handleChange}
                    className="form-control"
                  />
                </div>
                <div className="form-group">
                  <label>UAN</label>
                  <input
                    name="uan"
                    value={data.uan}
                    onChange={handleChange}
                    className="form-control"
                  />
                </div>
                <div className="form-group">
                  <label>PF No</label>
                  <input
                    name="pfNo"
                    value={data.pfNo}
                    onChange={handleChange}
                    className="form-control"
                  />
                </div>
                <div className="form-group">
                  <label>ESIC No</label>
                  <input
                    name="esicNo"
                    value={data.esicNo}
                    onChange={handleChange}
                    className="form-control"
                  />
                </div>
              </div>

              {/* Bank + Attendance */}
              <div className="col-md-6">
                <h6>Payment / Bank</h6>
                <div className="form-group">
                  <label>Bank Name</label>
                  <input
                    name="bankName"
                    value={data.bankName}
                    onChange={handleChange}
                    className="form-control"
                  />
                </div>
                <div className="form-group">
                  <label>Account No</label>
                  <input
                    name="accountNo"
                    value={data.accountNo}
                    onChange={handleChange}
                    className="form-control"
                  />
                </div>
                <div className="form-group">
                  <label>IFSC</label>
                  <input
                    name="ifsc"
                    value={data.ifsc}
                    onChange={handleChange}
                    className="form-control"
                  />
                </div>
                <div className="form-group">
                  <label>Payment Mode</label>
                  <input
                    name="paymentMode"
                    value={data.paymentMode}
                    onChange={handleChange}
                    className="form-control"
                  />
                </div>

                <h6 className="mt-3">Attendance</h6>
                <div className="d-flex gap-2">
                  <div>
                    <label>Days in Month</label>
                    <input
                      type="number"
                      name="daysInMonth"
                      value={data.daysInMonth}
                      onChange={handleChange}
                      className="form-control"
                    />
                  </div>
                  <div>
                    <label>Days Present</label>
                    <input
                      type="number"
                      name="daysPresent"
                      value={data.daysPresent}
                      onChange={handleChange}
                      className="form-control"
                    />
                  </div>
                  <div>
                    <label>Leaves</label>
                    <input
                      type="number"
                      name="leaves"
                      value={data.leaves}
                      onChange={handleChange}
                      className="form-control"
                    />
                  </div>
                </div>
              </div>
            </div>

            <hr />

            {/* Earnings + Deductions */}
            <div className="row">
              <div className="col-md-7">
                <h6>Earnings</h6>
                <div className="form-group">
                  <label>Basic</label>
                  <input
                    type="number"
                    name="basic"
                    value={data.basic}
                    onChange={handleChange}
                    className="form-control"
                  />
                </div>
                <div className="form-group">
                  <label>HRA</label>
                  <input
                    type="number"
                    name="hra"
                    value={data.hra}
                    onChange={handleChange}
                    className="form-control"
                  />
                </div>
                <div className="form-group">
                  <label>Conveyance</label>
                  <input
                    type="number"
                    name="conveyance"
                    value={data.conveyance}
                    onChange={handleChange}
                    className="form-control"
                  />
                </div>
                <div className="form-group">
                  <label>Medical</label>
                  <input
                    type="number"
                    name="medical"
                    value={data.medical}
                    onChange={handleChange}
                    className="form-control"
                  />
                </div>
                <div className="form-group">
                  <label>Special Allowance</label>
                  <input
                    type="number"
                    name="specialAllowance"
                    value={data.specialAllowance}
                    onChange={handleChange}
                    className="form-control"
                  />
                </div>
              </div>

              <div className="col-md-5">
                <h6>Deductions</h6>
                <div className="form-group">
                  <label>Provident Fund (PF)</label>
                  <input
                    type="number"
                    name="pf"
                    value={data.pf}
                    onChange={handleChange}
                    className="form-control"
                  />
                </div>
                <div className="form-group">
                  <label>Professional Tax</label>
                  <input
                    type="number"
                    name="professionalTax"
                    value={data.professionalTax}
                    onChange={handleChange}
                    className="form-control"
                  />
                </div>
                <div className="form-group">
                  <label>Income Tax</label>
                  <input
                    type="number"
                    name="incomeTax"
                    value={data.incomeTax}
                    onChange={handleChange}
                    className="form-control"
                  />
                </div>
                <div className="form-group">
                  <label>ESIC</label>
                  <input
                    type="number"
                    name="esic"
                    value={data.esic}
                    onChange={handleChange}
                    className="form-control"
                  />
                </div>
                <div className="form-group">
                  <label>Penalties</label>
                  <input
                    type="number"
                    name="penalties"
                    value={data.penalties}
                    onChange={handleChange}
                    className="form-control"
                  />
                </div>
              </div>
            </div>

            <hr />

            {/* Totals + Actions */}
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <div>
                  <strong>Total Earnings:</strong> ₹
                  {totals.earnings.toLocaleString()}
                </div>
                <div>
                  <strong>Total Deductions:</strong> ₹
                  {totals.deductions.toLocaleString()}
                </div>
                <div>
                  <strong>Net Pay:</strong> ₹{totals.net.toLocaleString()}
                </div>
                <div>
                  <strong>Approved By:</strong> {data.approvedBy || "Pending"}
                </div>
              </div>

              <div className="text-end">
                <div>
                  <label>Employee Email</label>
                </div>
                <input
                  name="employeeEmail"
                  value={data.employeeEmail}
                  onChange={handleChange}
                  className="form-control w-100"
                />
                <div className="mt-2 d-flex gap-2">
                  <button
                    className="btn btn-outline-secondary"
                    onClick={handleSavePdf}
                  >
                    Download PDF
                  </button>
                  <button
                    className="btn btn-primary"
                    onClick={handleSendMail}
                    disabled={sending}
                  >
                    {sending ? "Sending..." : "Send Mail"}
                  </button>
                </div>
              </div>
            </div>

            <hr />

            {/* Notes */}
            <div>
              <label>Notes</label>
              <textarea
                name="notes"
                value={data.notes}
                onChange={handleChange}
                className="form-control"
                rows={2}
              />
            </div>

            <div className="small muted text-end mt-2">
              This is a computer generated slip and does not require signature.
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
