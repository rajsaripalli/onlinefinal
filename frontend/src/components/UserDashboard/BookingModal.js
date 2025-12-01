import React, { useState } from 'react';
import { bookingsAPI } from '../../services/api';
import './UserDashboard.css';

const BookingModal = ({ flight, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    passengerName: '',
    passengerEmail: '',
    passengerPhone: '',
    numberOfSeats: 1
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

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
      const bookingData = {
        ...formData,
        flightId: flight.flightId,
        numberOfSeats: parseInt(formData.numberOfSeats)
      };
      const response = await bookingsAPI.create(bookingData);
      onSuccess(response.data.booking);
    } catch (err) {
      setError(err.response?.data?.error || 'Booking failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Book Flight</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">
          <div className="flight-summary">
            <h3>{flight.airline} - {flight.flightNumber}</h3>
            <p>{flight.departure} → {flight.destination}</p>
            <p>Price: ${flight.price} per seat</p>
          </div>
          <form onSubmit={handleSubmit} className="booking-form">
            <div className="form-group">
              <label>Passenger Name</label>
              <input
                type="text"
                name="passengerName"
                value={formData.passengerName}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Passenger Email</label>
              <input
                type="email"
                name="passengerEmail"
                value={formData.passengerEmail}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Passenger Phone</label>
              <input
                type="tel"
                name="passengerPhone"
                value={formData.passengerPhone}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Number of Seats</label>
              <input
                type="number"
                name="numberOfSeats"
                value={formData.numberOfSeats}
                onChange={handleChange}
                min="1"
                max={flight.availableSeats}
                required
              />
            </div>
            {error && <div className="error-message">{error}</div>}
            <div className="modal-actions">
              <button type="button" onClick={onClose} className="btn-cancel">
                Cancel
              </button>
              <button type="submit" disabled={loading} className="btn-primary">
                {loading ? 'Booking...' : 'Confirm Booking'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BookingModal;

