import React from 'react'
import Layout from '../../../components/Layout/Layout.jsx'
import SideBar from '../../../components/SideBar.jsx'

const AdminDashboard = () => {
  return (
    <>
    <Layout>
      <div className="d-flex ">
        <SideBar />

        {/* Main Content */}
        <div className="flex-grow-1 p-4" >
          <h2>This is  Admin Dashboard page</h2>
        </div>
      </div>

    </Layout>
  </>
    
  )
}

export default AdminDashboard