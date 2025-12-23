import React from 'react'
import SideBar from '../../components/SideBar.jsx'
import Layout from '../../components/Layout/Layout.jsx'

const AgentBooking = () => {
    return (
        <Layout>
            <div className="d-flex ">
                <SideBar />

                {/* Main Content */}
                <h5 className="text-center" >Agents booking will be displayed here</h5>
            </div>
        </Layout>

    )
}

export default AgentBooking