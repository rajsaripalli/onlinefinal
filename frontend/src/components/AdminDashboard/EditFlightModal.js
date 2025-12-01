import React, { useState, useEffect } from 'react';
import { flightsAPI } from '../../services/api';
import './AdminDashboard.css';

const EditFlightModal = ({ flight, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    flightNumber: '',
    airline: '',
    departure: '',
    destination: '',
    departureTime: '',
    arrivalTime: '',
    price: '',
    seats: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (flight) {
      // Format datetime for input
      const formatDateTime = (dateString) => {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `${year}-${month}-${day}T${hours}:${minutes}`;
      };

      setFormData({
        flightNumber: flight.flightNumber || '',
        airline: flight.airline || '',
        departure: flight.departure || '',
        destination: flight.destination || '',
        departureTime: flight.departureTime ? formatDateTime(flight.departureTime) : '',
        arrivalTime: flight.arrivalTime ? formatDateTime(flight.arrivalTime) : '',
        price: flight.price || '',
        seats: flight.seats || ''
      });
    }
  }, [flight]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await flightsAPI.update(flight.flightId, formData);
      onSuccess();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update flight');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Edit Flight</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">
          <form onSubmit={handleSubmit} className="flight-form">
            <div className="form-row">
              <div className="form-group">
                <label>Flight Number</label>
                <input
                  type="text"
                  name="flightNumber"
                  value={formData.flightNumber}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Airline</label>
                <input
                  type="text"
                  name="airline"
                  value={formData.airline}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Departure City</label>
                <input
                  type="text"
                  name="departure"
                  value={formData.departure}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Destination City</label>
                <input
                  type="text"
                  name="destination"
                  value={formData.destination}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Departure Time</label>
                <input
                  type="datetime-local"
                  name="departureTime"
                  value={formData.departureTime}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Arrival Time</label>
                <input
                  type="datetime-local"
                  name="arrivalTime"
                  value={formData.arrivalTime}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Price ($)</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  required
                />
              </div>
              <div className="form-group">
                <label>Total Seats</label>
                <input
                  type="number"
                  name="seats"
                  value={formData.seats}
                  onChange={handleChange}
                  min="1"
                  required
                />
              </div>
            </div>
            {error && <div className="error-message">{error}</div>}
            <div className="modal-actions">
              <button type="button" onClick={onClose} className="btn-cancel">
                Cancel
              </button>
              <button type="submit" disabled={loading} className="btn-primary">
                {loading ? 'Updating...' : 'Update Flight'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditFlightModal;

