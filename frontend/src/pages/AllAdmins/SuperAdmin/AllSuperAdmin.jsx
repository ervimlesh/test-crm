import React from 'react'
import Layout from '../../../components/Layout/Layout.jsx'
import SideBar from '../../../components/SideBar.jsx'

const AllSuperAdmin = () => {
    return (
        <Layout>
            <div className="d-flex ">
                <SideBar />

                {/* Main Content */}
                <div className="flex-grow-1 p-4" >
                    <h5>This is Super Admin Dashboard Where You'll get All the Record of Revenue & Deals comparasions</h5>
                </div>
            </div>

        </Layout>
    )
}

export default AllSuperAdmin