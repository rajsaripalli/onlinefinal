import React, { useState, useEffect } from 'react';
import { flightsAPI, bookingsAPI } from '../../services/api';
import AddFlightModal from './AddFlightModal';
import FlightsList from './FlightsList';
import BookingsList from './BookingsList';
import './AdminDashboard.css';

const AdminDashboard = ({ user, onLogout }) => {
  const [flights, setFlights] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [showAddFlight, setShowAddFlight] = useState(false);
  const [activeTab, setActiveTab] = useState('flights');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadFlights();
    loadBookings();
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

  const loadBookings = async () => {
    try {
      const response = await bookingsAPI.getAll();
      setBookings(response.data.bookings);
    } catch (err) {
      console.error('Failed to load bookings:', err);
    }
  };

  const handleFlightAdded = () => {
    setShowAddFlight(false);
    loadFlights();
  };

  const handleFlightDeleted = () => {
    loadFlights();
  };

  const handleFlightUpdated = () => {
    loadFlights();
  };

  return (
    <div className="admin-dashboard">
      <header className="dashboard-header">
        <h1>youGO - Admin Dashboard</h1>
        <div className="header-actions">
          <button onClick={onLogout} className="btn-logout">Logout</button>
        </div>
      </header>

      <div className="admin-tabs">
        <button
          className={activeTab === 'flights' ? 'tab active' : 'tab'}
          onClick={() => setActiveTab('flights')}
        >
          Flights
        </button>
        <button
          className={activeTab === 'bookings' ? 'tab active' : 'tab'}
          onClick={() => setActiveTab('bookings')}
        >
          Bookings
        </button>
      </div>

      {activeTab === 'flights' && (
        <div className="flights-section">
          <div className="section-header">
            <h2>Manage Flights</h2>
            <button onClick={() => setShowAddFlight(true)} className="btn-primary">
              Add New Flight
            </button>
          </div>
          {loading && <div className="loading">Loading flights...</div>}
          {error && <div className="error-message">{error}</div>}
          <FlightsList
            flights={flights}
            onDelete={handleFlightDeleted}
            onUpdate={handleFlightUpdated}
          />
        </div>
      )}

      {activeTab === 'bookings' && (
        <div className="bookings-section">
          <h2>All Bookings</h2>
          <BookingsList bookings={bookings} />
        </div>
      )}

      {showAddFlight && (
        <AddFlightModal
          onClose={() => setShowAddFlight(false)}
          onSuccess={handleFlightAdded}
        />
      )}
    </div>
  );
};

export default AdminDashboard;

