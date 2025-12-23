// frontend/src/pages/VoiceDetail.jsx
import React, { useState } from "react";
import axios from "axios";
import Layout from "../../components/Layout/Layout";
import SideBar from "../../components/SideBar";
import { useAuth } from "../../context/Auth";

const VoiceDetail = () => {
  const { auth } = useAuth();

  const [form, setForm] = useState({
    date: "",
    agent: auth?.user?._id,
    tfnNo: "",
    customerNo: "",
    airline: "",
    bhAd: "",
    language: "EN",
    conversion: "No",
    query: "",
  });

  const [message, setMessage] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/api/v1/auth/voice-detail", form);
      setMessage("Call logs  saved successfully!");
      setForm({
        date: "",

        tfnNo: "",
        customerNo: "",
        airline: "",
        bhAd: "",
        language: "EN",
        conversion: "No",
        query: "",
        linkedBooking: "",
      });
    } catch (error) {
      console.error(error);
      setMessage("Error saving record");
    }
  };

  return (
    <Layout>
      <main className="crm_all_body d-flex">
        <SideBar />
        <div className="crm_right relative p-4">
          <section className="box_crm_tr">
            <p className="title_common_semi">Call Logs Details</p>
            {message && <div className="alert alert-info">{message}</div>}
            <form
              onSubmit={handleSubmit}
              className="mt-2 flex_all form_box_auth"
            >
              {/* <div className="width_control_in50 box_sp">
                         <div className="box_crm_input">
                <label>Date</label>
                <input
                  type="date"
                  className="form-control box_crm_input_all"
                  name="date"
                  value={form.date}
                  onChange={handleChange}
                  required
                />
                   </div>
              </div> */}

              <div className="width_control_in50 box_sp">
                <div className="box_crm_input">
                  <label>TFN No.</label>
                  <input
                    type="text"
                    className="form-control box_crm_input_all"
                    name="tfnNo"
                    value={form.tfnNo}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="width_control_in50 box_sp">
                <div className="box_crm_input">
                  <label>Customer No.</label>
                  <input
                    type="text"
                    className="form-control box_crm_input_all"
                    name="customerNo"
                    value={form.customerNo}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <div className="width_control_in50 box_sp">
                <div className="box_crm_input">
                  <label>Airline</label>
                  <input
                    type="text"
                    className="form-control box_crm_input_all"
                    name="airline"
                    value={form.airline}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="width_control_in50 box_sp">
                <div className="box_crm_input">
                  <label>BH/AD</label>
                  <select
                    className="form-select box_crm_input_all"
                    name="bhAd"
                    value={form.bhAd}
                    onChange={handleChange}
                  >
                    <option value="">Select</option>
                    <option value="BH">BH</option>
                    <option value="AD">AD</option>
                  </select>
                </div>
              </div>
              <div className="width_control_in50 box_sp">
                <div className="box_crm_input">
                  <label>Language</label>
                  <select
                    className="form-select box_crm_input_all"
                    name="language"
                    value={form.language}
                    onChange={handleChange}
                  >
                    <option value="EN">English</option>
                    <option value="SP">Spanish</option>
                  </select>
                </div>
              </div>
              <div className="width_control_in50 box_sp">
                <div className="box_crm_input">
                  <label>Conversion</label>
                  <select
                    className="form-select box_crm_input_all"
                    name="conversion"
                    value={form.conversion}
                    onChange={handleChange}
                  >
                    <option value="No">No</option>
                    <option value="Yes">Yes</option>
                  </select>
                </div>
              </div>
              {/* <div className="col-md-6">
                <label className="form-label">Link Booking (optional)</label>
                <select
                  name="linkedBooking"
                  value={form.linkedBooking}
                  onChange={handleChange}
                  className="form-select"
                >
                  <option value="">None</option>
                  {bookings.map((b) => (
                    <option key={b._id} value={b._id}>
                      {b._id} - {b.airline}
                    </option>
                  ))}
                </select>
              </div> */}

              <div className="width_control_in100 box_sp">
                <div className="box_crm_input">
                  <label>Query</label>
                  <textarea
                    className="form-control box_crm_input_all"
                    name="query"
                    value={form.query}
                    onChange={handleChange}
                    rows="4"
                    required
                  />
                </div>
              </div>
              <div className="width_control_in100 box_sp mt-2">
                <button className="create_bid w-100" type="submit">
                  Submit Call Information
                </button>
              </div>
            </form>
          </section>
        </div>
      </main>
    </Layout>
  );
};

export default VoiceDetail;
