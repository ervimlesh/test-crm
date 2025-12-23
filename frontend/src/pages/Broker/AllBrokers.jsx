import React from 'react'
import SideBar from '../../components/SideBar.jsx'
import Layout from '../../components/Layout/Layout.jsx'

const AllBrokers = () => {
    return (
        <>
            <Layout>
                <div className="d-flex ">
                    <SideBar />

                    {/* Main Content */}
                    <div className="flex-grow-1 p-4" >
                        <h2 className='text-center'>This is  All borkers page</h2>
                    </div>
                </div>

            </Layout>
        </>
    )
}

export default AllBrokers