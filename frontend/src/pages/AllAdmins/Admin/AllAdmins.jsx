import React, { useEffect, useState } from 'react'
import Layout from '../../../components/Layout/Layout.jsx'
import SideBar from '../../../components/SideBar.jsx'
import axios from 'axios'

const AllAdmins = () => {
  const [admin, setAdmin] = useState([])


  useEffect(() => {
    fetchAdmin();
  }, []);

  const fetchAdmin = async () => {

    try {
      const res = await axios.get('/api/v1/auth/get-all-admins');
      setAdmin(res.data);
      console.log(res.data);
    } catch (err) {
      console.log(err);

    }
  }

  return (
    <>
      <Layout>
        <div className="d-flex ">
          <SideBar />

          {/* Main Content */}
          <div className="flex-grow-1 p-4" >
            <h2 className='text-start'>Admins</h2>
            <table className="table table-striped table-bordered">
              <thead>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">Name</th>
                  <th scope="col">Email</th>
                  
                  <th scope="col">Role</th>
                  {/* <th scope="col">Status</th>
 */}

                </tr>
              </thead>

              <tbody>
                {admin ? (
                  <>
                    {
                      admin?.data?.map((deal, index) => (
                        <tr key={deal._id}>
                          <th scope="row">{index + 1}</th>
                          <td>{deal.userName}</td>
                          <td>{deal.email}</td>
                          <td>{deal.number || '-'}</td>
                          <td>{deal.role}</td>
                          <td>
                            {/* <button
                                                        className={
                                                            deal.status === 'pending' ? 'btn btn-warning' :
                                                                deal.status === 'success' ? 'btn btn-success' :
                                                                    ''
                                                        }
                                                    >
                                                        {deal.status}
                                                    </button> */}
                            {/* {deal.status === "pending" ? (
                              <>
                                <button className='btn btn-primary' onClick={() => updateStatus(deal._id, "approved")}>Approve</button>
                                <button className='btn btn-danger' onClick={() => updateStatus(deal._id, "rejected")}>Reject</button>
                              </>
                            ) : (
                              <success>{<button
                                className={
                                  deal.status === 'rejected' ? 'btn btn-warning' :
                                    deal.status === 'approved' ? 'btn btn-success' :
                                      ''
                                }
                              >
                                {deal.status}
                              </button>}</success>
                            )} */}
                          </td>

                        </tr>

                      ))
                    }
                  </>
                ) : (

                  <tr>
                    <td colSpan="23" className="text-center">
                      <h1>not available</h1>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

          </div>
        </div>

      </Layout>
    </>
  )
}

export default AllAdmins