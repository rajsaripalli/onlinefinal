import React, { useState } from 'react';
import { flightsAPI } from '../../services/api';
import EditFlightModal from './EditFlightModal';
import './AdminDashboard.css';

const FlightsList = ({ flights, onDelete, onUpdate }) => {
  const [editingFlight, setEditingFlight] = useState(null);

  const handleDelete = async (flightId) => {
    if (window.confirm('Are you sure you want to delete this flight?')) {
      try {
        await flightsAPI.delete(flightId);
        onDelete();
      } catch (err) {
        alert(err.response?.data?.error || 'Failed to delete flight');
      }
    }
  };

  const handleEdit = (flight) => {
    setEditingFlight(flight);
  };

  const handleUpdateSuccess = () => {
    setEditingFlight(null);
    onUpdate();
  };

  if (flights.length === 0) {
    return <div className="no-data">No flights added yet.</div>;
  }

  return (
    <div className="flights-list">
      {flights.map(flight => (
        <div key={flight.flightId} className="admin-flight-card">
          <div className="flight-info">
            <div className="flight-main">
              <h3>{flight.airline} - {flight.flightNumber}</h3>
              <div className="flight-route">
                <span>{flight.departure}</span>
                <span>→</span>
                <span>{flight.destination}</span>
              </div>
            </div>
            <div className="flight-details">
              <div className="detail-item">
                <span>Departure:</span>
                <strong>{new Date(flight.departureTime).toLocaleString()}</strong>
              </div>
              <div className="detail-item">
                <span>Arrival:</span>
                <strong>{new Date(flight.arrivalTime).toLocaleString()}</strong>
              </div>
              <div className="detail-item">
                <span>Price:</span>
                <strong>${flight.price}</strong>
              </div>
              <div className="detail-item">
                <span>Seats:</span>
                <strong>{flight.availableSeats} / {flight.seats}</strong>
              </div>
            </div>
          </div>
          <div className="flight-actions">
            <button onClick={() => handleEdit(flight)} className="btn-edit">
              Edit
            </button>
            <button onClick={() => handleDelete(flight.flightId)} className="btn-delete">
              Delete
            </button>
          </div>
        </div>
      ))}
      {editingFlight && (
        <EditFlightModal
          flight={editingFlight}
          onClose={() => setEditingFlight(null)}
          onSuccess={handleUpdateSuccess}
        />
      )}
    </div>
  );
};

export default FlightsList;

