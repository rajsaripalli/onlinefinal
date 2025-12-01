import React from 'react';
import './UserDashboard.css';

const MyBookings = ({ bookings, onViewTicket }) => {
  if (bookings.length === 0) {
    return (
      <div className="my-bookings">
        <h2>My Bookings</h2>
        <div className="no-bookings">You have no bookings yet.</div>
      </div>
    );
  }

  return (
    <div className="my-bookings">
      <h2>My Bookings</h2>
      <div className="bookings-list">
        {bookings.map(booking => (
          <div key={booking.bookingId} className="booking-card">
            <div className="booking-header">
              <div>
                <h3>PNR: {booking.pnr}</h3>
                <span className={`status-badge ${booking.status}`}>
                  {booking.status}
                </span>
              </div>
            </div>
            <div className="booking-details">
              <div className="detail-row">
                <span>Flight:</span>
                <strong>{booking.flightDetails.flightNumber} - {booking.flightDetails.airline}</strong>
              </div>
              <div className="detail-row">
                <span>Route:</span>
                <strong>{booking.flightDetails.departure} → {booking.flightDetails.destination}</strong>
              </div>
              <div className="detail-row">
                <span>Passenger:</span>
                <strong>{booking.passengerName}</strong>
              </div>
              <div className="detail-row">
                <span>Seats:</span>
                <strong>{booking.numberOfSeats}</strong>
              </div>
              <div className="detail-row">
                <span>Total Price:</span>
                <strong>${booking.totalPrice}</strong>
              </div>
              <div className="detail-row">
                <span>Booking Date:</span>
                <strong>{new Date(booking.bookingDate).toLocaleDateString()}</strong>
              </div>
            </div>
            <button
              onClick={() => onViewTicket(booking)}
              className="view-ticket-button"
            >
              View Ticket
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyBookings;

