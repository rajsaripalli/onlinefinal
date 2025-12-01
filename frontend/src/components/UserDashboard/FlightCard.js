import React from 'react';
import './UserDashboard.css';

const FlightCard = ({ flight, onBook }) => {
  return (
    <div className="flight-card">
      <div className="flight-header">
        <h3>{flight.airline}</h3>
        <span className="flight-number">{flight.flightNumber}</span>
      </div>
      <div className="flight-route">
        <div className="route-item">
          <div className="route-time">{flight.departureTime}</div>
          <div className="route-city">{flight.departure}</div>
        </div>
        <div className="route-arrow">→</div>
        <div className="route-item">
          <div className="route-time">{flight.arrivalTime}</div>
          <div className="route-city">{flight.destination}</div>
        </div>
      </div>
      <div className="flight-details">
        <div className="detail-item">
          <span>Price:</span>
          <strong>${flight.price}</strong>
        </div>
        <div className="detail-item">
          <span>Available Seats:</span>
          <strong>{flight.availableSeats}</strong>
        </div>
      </div>
      <button
        onClick={() => onBook(flight)}
        disabled={flight.availableSeats === 0}
        className="book-button"
      >
        {flight.availableSeats === 0 ? 'Sold Out' : 'Book Now'}
      </button>
    </div>
  );
};

export default FlightCard;

