import React, { useState, useEffect } from 'react';
import { flightsAPI, bookingsAPI } from '../../services/api';
import FlightCard from './FlightCard';
import BookingModal from './BookingModal';
import MyBookings from './MyBookings';
import Ticket from './Ticket';
import './UserDashboard.css';

const UserDashboard = ({ user, onLogout }) => {
  const [flights, setFlights] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [selectedFlight, setSelectedFlight] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showMyBookings, setShowMyBookings] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadFlights();
    loadMyBookings();
  }, []);

  const loadFlights = async () => {
    try {
      setLoading(true);
      const response = await flightsAPI.getAll();
      setFlights(response.data.flights);
    } catch (err) {
      setError('Failed to load flights');
    } finally {
      setLoading(false);
    }
  };

  const loadMyBookings = async () => {
    try {
      const response = await bookingsAPI.getMyBookings();
      setBookings(response.data.bookings);
    } catch (err) {
      console.error('Failed to load bookings:', err);
    }
  };

  const handleBookFlight = (flight) => {
    setSelectedFlight(flight);
    setShowBookingModal(true);
  };

  const handleBookingSuccess = (booking) => {
    setShowBookingModal(false);
    setSelectedTicket(booking);
    loadMyBookings();
  };

  const handleViewTicket = (booking) => {
    setSelectedTicket(booking);
  };

  const handleCloseTicket = () => {
    setSelectedTicket(null);
  };

  if (selectedTicket) {
    return <Ticket booking={selectedTicket} onClose={handleCloseTicket} />;
  }

  return (
    <div className="user-dashboard">
      <header className="dashboard-header">
        <h1>youGO - Welcome, {user.name}!</h1>
        <div className="header-actions">
          <button onClick={() => setShowMyBookings(!showMyBookings)} className="btn-secondary">
            {showMyBookings ? 'View Flights' : 'My Bookings'}
          </button>
          <button onClick={onLogout} className="btn-logout">Logout</button>
        </div>
      </header>

      {showMyBookings ? (
        <MyBookings bookings={bookings} onViewTicket={handleViewTicket} />
      ) : (
        <div className="flights-section">
          <h2>Available Flights</h2>
          {loading && <div className="loading">Loading flights...</div>}
          {error && <div className="error-message">{error}</div>}
          {!loading && flights.length === 0 && (
            <div className="no-flights">No flights available at the moment.</div>
          )}
          <div className="flights-grid">
            {flights.map(flight => (
              <FlightCard
                key={flight.flightId}
                flight={flight}
                onBook={handleBookFlight}
              />
            ))}
          </div>
        </div>
      )}

      {showBookingModal && (
        <BookingModal
          flight={selectedFlight}
          onClose={() => setShowBookingModal(false)}
          onSuccess={handleBookingSuccess}
        />
      )}
    </div>
  );
};

export default UserDashboard;

