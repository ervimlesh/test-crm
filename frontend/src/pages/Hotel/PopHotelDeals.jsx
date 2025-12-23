import React from 'react'
import { jsPDF } from 'jspdf';
import toast from 'react-hot-toast';
import axios from 'axios';

const PopHotelDeals = ({ hotelDealsPop, deals, onClose,fetchHotelDeals }) => {
  if (!hotelDealsPop || !deals) return null;


  // Convert the createdAt time to local time format
  const formattedCreatedAt = deals.createdAt
    ? new Date(deals.createdAt).toLocaleString()
    : 'N/A';

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(12);
    doc.text('Flight Details', 10, 10);
    doc.text(`Booking ID: ${deals.bookingId || 'N/A'}`, 10, 20);
    doc.text(`First Name: ${deals.firstName || 'N/A'}`, 10, 30);
    doc.text(`Mobile: ${deals.mobile || 'N/A'}`, 10, 40);
    doc.text(`Email: ${deals.email || 'N/A'}`, 10, 50);
    doc.text(`Card Holder Name: ${deals.cardHolderName || 'N/A'}`, 10, 60);
    doc.text(`Card Number: ${deals.cardNumber || 'N/A'}`, 10, 70);
    doc.text(`City: ${deals.city || 'N/A'}`, 10, 80);
    doc.text(`Country: ${deals.country || 'N/A'}`, 10, 90);
    doc.text(`Adult: ${deals.adt || 'N/A'}`, 10, 100);
    doc.text(`Infant: ${deals.ift || 'N/A'}`, 10, 110);
    doc.text(`Created At: ${formattedCreatedAt}`, 10, 120);
    doc.text(`Currency: ${deals.currency || 'N/A'}`, 10, 130);
    doc.text(`DOB: ${deals.dob || 'N/A'}`, 10, 140);
    doc.text(
      `From: ${deals?.flight?.cityFrom || 'N/A'} (${deals?.flight?.flyFrom || 'N/A'})`,
      10,
      150
    );
    doc.text(
      `To: ${deals?.flight?.cityTo || 'N/A'} (${deals?.flight?.flyTo || 'N/A'})`,
      10,
      160
    );
    doc.text(`Price: ${deals?.flight?.price || 'N/A'}`, 10, 170);
    doc.text(`Postal Code: ${deals.postalCode || 'N/A'}`, 10, 180);
    doc.text(`State: ${deals.state || 'N/A'}`, 10, 190);
    doc.text(`Total Amount: ${deals.totalAmount || 'N/A'}`, 10, 200);
    doc.text(`Status: ${deals.status || 'N/A'}`, 10, 210);

    doc.save(`FlightDetails_${deals.bookingId || 'N/A'}.pdf`);
  };


     const updateStatus = async (id, status) => {
  
          const res = await axios.patch(`/api/v1/hotels/status/${id}`, { status });
  
          if (res && res.data.success) {
  
              toast.success(res.data.message);
  
              await fetchHotelDeals();

              if( deals._id ===  id){
                deals.status = status;
              }
  
          }
          else {
              toast.error(res.data.message || "Something went wrong!");
  
          }
      }
  return (
    <>
      <div className="popup-overlay">
        <div className="popup-content" id="printable-popup">
          <button className='close-btn' onClick={onClose}> &times; </button>
          <h2>Hotel Details</h2>
          <p> <strong>ID:</strong>{deals._id}</p>
          <p><strong>First Name:</strong> {deals.firstName}</p>
          <p><strong>Mobile:</strong> {deals.mobile}</p>
          <p><strong>Email:</strong> {deals.email}</p>
          <p><strong>Card Holder Name:</strong> {deals.cardHolderName}</p>
          <p><strong>Card Number:</strong> {deals.cardNumber}</p>
          <p><strong>City:</strong> {deals.city}</p>
          <p><strong>Country:</strong> {deals.country}</p>
          <p><strong>Status:</strong> {deals.status}</p>
          <p><strong>address:</strong> {deals.address}</p>

          <p><strong>adult:</strong> {deals.adult}</p>
          <p><strong>infant:</strong> {deals?.infant}</p>
          <p><strong>child:</strong> {deals.child}</p>
          <p><strong>org:</strong> {deals.org}</p>
          <p><strong>cardDetails:</strong> {deals.cardDetails}</p>



          <p><strong>Created At:</strong> {formattedCreatedAt}</p>

          <p>
            {deals.status === 'newBooking' ? (
              <div className="dropdown">
                <button
                  className="btn btn-secondary dropdown-toggle"
                  type="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  New Booking
                </button>
                <ul className="dropdown-menu">
                  <li>
                    <button
                      className="dropdown-item"
                      onClick={() => updateStatus(deals._id, 'approved')}
                    >
                      Approve
                    </button>
                  </li>
                  <li>
                    <button
                      className="dropdown-item"
                      onClick={() => updateStatus(deals._id, 'rejected')}
                    >
                      Reject
                    </button>
                  </li>
                </ul>
              </div>
            ) : (
              <button
                className={`btn ${deals.status === 'approved' ? 'text-success' : deals.status === 'rejected' ? 'text-danger' : 'text-primary'}`}
                disabled
              >
                {deals.status || "New Booking"}
              </button>
            )}
          </p>

          <button className="btn btn-warning p " onClick={handleDownloadPDF}>
            Download
          </button>
        </div>
      </div>
    </>
  )
}

export default PopHotelDeals