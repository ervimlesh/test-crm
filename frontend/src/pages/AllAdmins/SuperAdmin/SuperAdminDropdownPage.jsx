import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import Layout from "../../../components/Layout/Layout.jsx";
import SideBar from "../../../components/SideBar.jsx";

const SuperAdminDropdownPage = () => {
  const [type, setType] = useState("airlines");
  const [label, setLabel] = useState("");
  const [value, setValue] = useState("");
  const [dropdownItems, setDropdownItems] = useState([]);
  const [editId, setEditId] = useState(null);
  const [editLabel, setEditLabel] = useState("");
  const [editValue, setEditValue] = useState("");

  const dropdownTypes = ["class", "currency", "cardType"];

  const fetchDropdownItems = async () => {
    try {
      const res = await axios.get(`/api/v1/dropdown/get-dropdown?type=${type}`);
      setDropdownItems(res?.data?.items);
    } catch (err) {
      toast.error("Failed to load dropdown items");
    }
  };

  useEffect(() => {
    fetchDropdownItems();
  }, [type]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!value) return toast.error("All fields are required");

    try {
      await axios.post("/api/v1/dropdown/add-dropdown", {
        type,
        label,
        value,
      });
      toast.success("Dropdown item added!");
      setLabel("");
      setValue("");
      fetchDropdownItems();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add dropdown");
    }
  };

  const handleEdit = (item) => {
    setEditId(item._id);
    setEditLabel(item.label);
    setEditValue(item.value);
  };

  const handleEditSubmit = async (id) => {
    try {
      await axios.put(`/api/v1/dropdown/update-dropdown/${id}`, {
        label: editLabel,
        value: editValue,
      });
      toast.success("Updated successfully!");
      setEditId(null);
      setEditLabel("");
      setEditValue("");
      fetchDropdownItems();
    } catch (err) {
      toast.error("Failed to update dropdown");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;
    try {
      await axios.delete(`/api/v1/dropdown/delete-dropdown/${id}`);
      toast.success("Deleted successfully!");
      fetchDropdownItems();
    } catch (err) {
      toast.error("Failed to delete item");
    }
  };

  return (
    <Layout>
      <main class="crm_all_body d-flex">
        <SideBar />
        <div className="crm_right relative">
          <p className="title_common_semi">
            {" "}
            ADD Airline Class | Currency | Card Type
          </p>
          <div className="box_crm_tr mt-4">
            <form
              onSubmit={handleSubmit}
              className=""
            >
              <div className="mb-3 flex_all form_box_auth">
                <div className="width_control_in100"> 
                <div className="box_crm_input">
                <label>Dropdown Type</label>
                <select
                  className="form-select box_crm_input_all cap_font"
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                >
                  {dropdownTypes.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
                </div>
                </div>
                 <div className="mt-3 box_crm_input width_control_in100">
                <label>Label</label>
                <input
                  type="text"
                  className="form-control box_crm_input_all"
                  value={label}
                  onChange={(e) => setLabel(e.target.value)}
                />
              </div>
                <div className="width_control_in100 mt-3"> 
             <div className="box_crm_input">
                <label>Value</label>
                <input
                  type="text"
                  className="form-control box_crm_input_all"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                />
              </div>
              
   </div>
    
   <div className="width_control_in100 mt-4"> 
              <button type="submit" className="create_bid">
                Add Dropdown Value
              </button>
              </div>
              </div>

              
 
            </form>
          </div>
          <div className="box_crm_tr mt-4">
            <p className="crm_title">
              Current Values for <strong className="highlight_c">{type}</strong>
            </p>

            <ul className="list_valuess">
              {dropdownItems?.map((item) => (
                <li
                  key={item._id}
                  className="list-group-item d-flex justify-content-between align-items-center"
                >
                  {editId === item._id ? (
                    <div className="edit_cont_valuess w-100">
                      {/* <input
                        type="text"
                        value={editLabel}
                        onChange={(e) => setEditLabel(e.target.value)}
                        className="form-control"
                        placeholder="Label"
                      /> */}
                      <input
                        type="text"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        className="form-control"
                        placeholder="Value"
                      />
                      <div className="action_provider_btn_main">
                      <button
                        onClick={() => handleEditSubmit(item._id)}
                        className="action_provider_btn"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditId(null)}
                        className="action_provider_btn action_provider_dlt"
                      >
                        Cancel
                      </button>
                       </div>
                    </div>
                  ) : (
                    <>
                      <div className="current_title_ac">
                        {/* <div>{item.label}</div> */}
                        <div>{item.value}</div>
                      </div>

                      <div className="action_provider_btn_main">
                        <button
                          className="action_provider_btn"
                          onClick={() => handleEdit(item)}
                        >
                          <img src="/imgs/edit.png" />
                          Edit
                        </button>
                        <button
                          className="action_provider_btn action_provider_dlt"
                          onClick={() => handleDelete(item._id)}
                        >
                          <img src="/imgs/delete-i.png" />
                          Delete
                        </button>
                      </div>
                    </>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </main>
    </Layout>
  );
};

export default SuperAdminDropdownPage;
