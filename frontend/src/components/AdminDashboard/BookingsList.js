import React from 'react';
import './AdminDashboard.css';

const BookingsList = ({ bookings }) => {
  if (bookings.length === 0) {
    return <div className="no-data">No bookings found.</div>;
  }

  return (
    <div className="bookings-list-admin">
      <div className="bookings-table">
        <div className="table-header">
          <div>PNR</div>
          <div>User Email</div>
          <div>Passenger</div>
          <div>Flight</div>
          <div>Route</div>
          <div>Seats</div>
          <div>Total Price</div>
          <div>Status</div>
          <div>Booking Date</div>
        </div>
        {bookings.map(booking => (
          <div key={booking.bookingId} className="table-row">
            <div><strong>{booking.pnr}</strong></div>
            <div>{booking.userEmail}</div>
            <div>
              <div>{booking.passengerName}</div>
              <div className="small-text">{booking.passengerEmail}</div>
              <div className="small-text">{booking.passengerPhone}</div>
            </div>
            <div>
              <div>{booking.flightDetails.flightNumber}</div>
              <div className="small-text">{booking.flightDetails.airline}</div>
            </div>
            <div>
              {booking.flightDetails.departure} → {booking.flightDetails.destination}
            </div>
            <div>{booking.numberOfSeats}</div>
            <div><strong>${booking.totalPrice}</strong></div>
            <div>
              <span className={`status-badge ${booking.status}`}>
                {booking.status}
              </span>
            </div>
            <div>{new Date(booking.bookingDate).toLocaleString()}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BookingsList;

