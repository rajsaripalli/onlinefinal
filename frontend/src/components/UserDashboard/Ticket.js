import React from 'react';
import './UserDashboard.css';

const Ticket = ({ booking, onClose }) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="ticket-container">
      <div className="ticket-actions">
        <button onClick={handlePrint} className="btn-primary">Print Ticket</button>
        <button onClick={onClose} className="btn-secondary">Close</button>
      </div>
      <div className="ticket" id="ticket">
        <div className="ticket-header">
          <h1>youGO</h1>
          <div className="ticket-type">E-TICKET</div>
        </div>
        <div className="ticket-body">
          <div className="ticket-section">
            <h3>Booking Information</h3>
            <div className="ticket-info">
              <div className="info-row">
                <span>PNR Number:</span>
                <strong>{booking.pnr}</strong>
              </div>
              <div className="info-row">
                <span>Booking Date:</span>
                <strong>{new Date(booking.bookingDate).toLocaleString()}</strong>
              </div>
              <div className="info-row">
                <span>Status:</span>
                <strong className={`status-badge ${booking.status}`}>{booking.status}</strong>
              </div>
            </div>
          </div>

          <div className="ticket-section">
            <h3>Flight Details</h3>
            <div className="ticket-info">
              <div className="info-row">
                <span>Airline:</span>
                <strong>{booking.flightDetails.airline}</strong>
              </div>
              <div className="info-row">
                <span>Flight Number:</span>
                <strong>{booking.flightDetails.flightNumber}</strong>
              </div>
              <div className="info-row">
                <span>Route:</span>
                <strong>{booking.flightDetails.departure} → {booking.flightDetails.destination}</strong>
              </div>
              <div className="info-row">
                <span>Departure Time:</span>
                <strong>{booking.flightDetails.departureTime}</strong>
              </div>
              <div className="info-row">
                <span>Arrival Time:</span>
                <strong>{booking.flightDetails.arrivalTime}</strong>
              </div>
            </div>
          </div>

          <div className="ticket-section">
            <h3>Passenger Details</h3>
            <div className="ticket-info">
              <div className="info-row">
                <span>Name:</span>
                <strong>{booking.passengerName}</strong>
              </div>
              <div className="info-row">
                <span>Email:</span>
                <strong>{booking.passengerEmail}</strong>
              </div>
              <div className="info-row">
                <span>Phone:</span>
                <strong>{booking.passengerPhone}</strong>
              </div>
              <div className="info-row">
                <span>Number of Seats:</span>
                <strong>{booking.numberOfSeats}</strong>
              </div>
            </div>
          </div>

          <div className="ticket-section">
            <h3>Payment Details</h3>
            <div className="ticket-info">
              <div className="info-row">
                <span>Total Amount:</span>
                <strong className="amount">${booking.totalPrice}</strong>
              </div>
            </div>
          </div>
        </div>
        <div className="ticket-footer">
          <p>Thank you for choosing youGO!</p>
          <p>Please arrive at the airport at least 2 hours before departure.</p>
        </div>
      </div>
    </div>
  );
};

export default Ticket;

