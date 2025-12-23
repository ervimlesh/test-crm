import React from 'react'
import Layout from '../../../components/Layout/Layout'
import SideBar from '../../../components/SideBar'

const AdminBooking = () => {
    return (
        <Layout>
            <div className='d-flex '>
                <SideBar />

                {/* Main Content */}
                <div className=''>All Admin Booking  page</div>

            </div>


        </Layout>
    )
}

export default AdminBooking