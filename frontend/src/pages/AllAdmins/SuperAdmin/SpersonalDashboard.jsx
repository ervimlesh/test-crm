import React from 'react'
import UserSidebar from '../../../components/UserSidebar.jsx'


const SpersonalDashboard = () => {
  return (
    <>
    <div className="d-flex">
        <div>
           <UserSidebar />

        </div>

        <div>
            <h2>Personal Dashboard</h2>
            <p>Welcome to your personal dashboard!</p>
            <p>Here you can view your personal information and manage your account settings.</p>
            <p>If you have any questions or need assistance, please feel free to reach out to our support team.</p>
            <p>Thank you for being a valued user!</p>
        </div>
    </div>
    </>
  )
}

export default SpersonalDashboard