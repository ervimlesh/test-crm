import React from 'react'
import Layout from '../../../components/Layout/Layout.jsx'
import SideBar from '../../../components/SideBar.jsx'

const SuperAdminDashboard = () => {
  return (
    <Layout>
      <div className="d-flex ">
        <SideBar />


        {/* Main Content */}
        <div className="flex-grow-1 p-4" >
          <h2></h2>


          <div className="mt-4">
            <div className="nav nav-tabs" id="comparison-tabs" role="tablist">
              <button
                className="nav-link active"
                id="comparison1-tab"
                data-bs-toggle="tab"
                data-bs-target="#comparison1"
                type="button"
                role="tab"
                aria-controls="comparison1"
                aria-selected="true"
              >
                Total Revenue From Flight Deals
              </button>
              <button
                className="nav-link"
                id="comparison2-tab"
                data-bs-toggle="tab"
                data-bs-target="#comparison2"
                type="button"
                role="tab"
                aria-controls="comparison2"
                aria-selected="false"
              >
                Total Revenue Hotel Deals
              </button>
              <button
                className="nav-link"
                id="comparison3-tab"
                data-bs-toggle="tab"
                data-bs-target="#comparison3"
                type="button"
                role="tab"
                aria-controls="comparison3"
                aria-selected="false"
              >
                Total Revenue From All Deals
              </button>
            </div>
            <div className="tab-content" id="comparison-tabs-content">
              <div
                className="tab-pane fade show active"
                id="comparison1"
                role="tabpanel"
                aria-labelledby="comparison1-tab"
              >
                <div className="mt-3 d-flex gap-3 justify-content-between border p-3 rounded">
                  <div className="mt-3 border p-4 rounded">
                    <h5>Flights</h5>
                    <p>Revenue From Flight</p>
                  </div>
                  <div className="mt-3 border p-4 rounded">
                    <h5>closed Deals</h5>
                    <p>$ 128363 </p>
                  </div>
                  <div className="mt-3 border p-4 rounded">
                    <h5>Remaining Deals</h5>
                    <p>$ 2934738 </p>
                  </div>
                </div>

              </div>
              <div
                className="tab-pane fade"
                id="comparison2"
                role="tabpanel"
                aria-labelledby="comparison2-tab"
              >
                <div className="mt-3 d-flex gap-3 justify-content-between border p-3 rounded">
                  <div className="mt-3 border p-4 rounded">
                    <h5>Hotels</h5>
                    <p>total Revenue</p>
                    <p>$ 937372</p>
                  </div>
                  <div className="mt-3 border p-4 rounded">
                    <h5>closed Deals</h5>
                    <p> $ 836327 </p>
                  </div>
                  <div className="mt-3 border p-4 rounded">
                    <h5>Remaining Deals</h5>
                    <p> $ 93873</p>
                  </div>
                </div>
              </div>
              <div
                className="tab-pane fade"
                id="comparison3"
                role="tabpanel"
                aria-labelledby="comparison3-tab"
              >
                <div className="mt-3 d-flex gap-3 justify-content-between border p-3 rounded">
                  <div className="mt-3 border p-4 rounded">
                    <h5>Total Deals</h5>
                    <p>200  Deals Generate </p>
                  </div>
                  <div className="mt-3 border p-4 rounded">
                    <h5>closed Deals</h5>
                    <p>95  Deals Generate </p>
                  </div>
                  <div className="mt-3 border p-4 rounded">
                    <h5>Remaining Deals</h5>
                    <p>105  Deals Generate </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>

  )
}

export default SuperAdminDashboard