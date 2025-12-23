import React from 'react'
import Layout from '../../components/Layout/Layout.jsx'
import SideBar from '../../components/SideBar.jsx'

const MarketingHome = () => {
  return (
     <Layout>
      <main class="crm_all_body d-flex">
        <SideBar />
        <section className="">
          <div className="header_crm flex_props justify-content-between">
            <p className="crm_title text-center"> Welcome to the Marketing page </p>
          </div>

          
        </section>
      </main>
    </Layout>
  )
}

export default MarketingHome