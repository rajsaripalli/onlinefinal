const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { dynamodb, TABLES } = require('../config/dynamodb');
const { authenticateToken, authenticateAdmin } = require('../middleware/auth');

const router = express.Router();

// Create booking (User)
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { flightId, passengerName, passengerEmail, passengerPhone, numberOfSeats } = req.body;
    const userEmail = req.user.email;

    if (!flightId || !passengerName || !passengerEmail || !passengerPhone || !numberOfSeats) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Get flight details
    const flightResult = await dynamodb.get({
      TableName: TABLES.FLIGHTS,
      Key: { flightId }
    }).promise();

    if (!flightResult.Item) {
      return res.status(404).json({ error: 'Flight not found' });
    }

    const flight = flightResult.Item;

    if (flight.availableSeats < parseInt(numberOfSeats)) {
      return res.status(400).json({ error: 'Not enough seats available' });
    }

    // Generate PNR
    const pnr = `PNR${Date.now()}${Math.floor(Math.random() * 1000)}`;

    // Create booking
    const booking = {
      bookingId: uuidv4(),
      pnr,
      flightId,
      userEmail,
      passengerName,
      passengerEmail,
      passengerPhone,
      numberOfSeats: parseInt(numberOfSeats),
      totalPrice: flight.price * parseInt(numberOfSeats),
      flightDetails: {
        flightNumber: flight.flightNumber,
        airline: flight.airline,
        departure: flight.departure,
        destination: flight.destination,
        departureTime: flight.departureTime,
        arrivalTime: flight.arrivalTime
      },
      bookingDate: new Date().toISOString(),
      status: 'confirmed'
    };

    await dynamodb.put({
      TableName: TABLES.BOOKINGS,
      Item: booking
    }).promise();

    // Update available seats in flight
    await dynamodb.update({
      TableName: TABLES.FLIGHTS,
      Key: { flightId },
      UpdateExpression: 'SET availableSeats = availableSeats - :seats',
      ExpressionAttributeValues: {
        ':seats': parseInt(numberOfSeats)
      },
      ReturnValues: 'ALL_NEW'
    }).promise();

    res.status(201).json({
      message: 'Booking confirmed successfully',
      booking
    });
  } catch (error) {
    console.error('Create booking error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get user's bookings
router.get('/my-bookings', authenticateToken, async (req, res) => {
  try {
    const userEmail = req.user.email;

    const result = await dynamodb.scan({
      TableName: TABLES.BOOKINGS,
      FilterExpression: 'userEmail = :email',
      ExpressionAttributeValues: {
        ':email': userEmail
      }
    }).promise();

    res.json({
      bookings: result.Items || []
    });
  } catch (error) {
    console.error('Get user bookings error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get booking by PNR
router.get('/pnr/:pnr', authenticateToken, async (req, res) => {
  try {
    const { pnr } = req.params;
    const userEmail = req.user.email;

    const result = await dynamodb.scan({
      TableName: TABLES.BOOKINGS,
      FilterExpression: 'pnr = :pnr AND userEmail = :email',
      ExpressionAttributeValues: {
        ':pnr': pnr,
        ':email': userEmail
      }
    }).promise();

    if (result.Items.length === 0) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    res.json({
      booking: result.Items[0]
    });
  } catch (error) {
    console.error('Get booking by PNR error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all bookings (Admin only)
router.get('/all', authenticateToken, authenticateAdmin, async (req, res) => {
  try {
    const result = await dynamodb.scan({
      TableName: TABLES.BOOKINGS
    }).promise();

    res.json({
      bookings: result.Items || []
    });
  } catch (error) {
    console.error('Get all bookings error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get booking by ID (Admin)
router.get('/:bookingId', authenticateToken, authenticateAdmin, async (req, res) => {
  try {
    const { bookingId } = req.params;

    const result = await dynamodb.get({
      TableName: TABLES.BOOKINGS,
      Key: { bookingId }
    }).promise();

    if (!result.Item) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    res.json({
      booking: result.Item
    });
  } catch (error) {
    console.error('Get booking error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update booking (Admin only)
router.put('/:bookingId', authenticateToken, authenticateAdmin, async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ error: 'Status is required' });
    }

    const result = await dynamodb.update({
      TableName: TABLES.BOOKINGS,
      Key: { bookingId },
      UpdateExpression: 'SET #status = :status',
      ExpressionAttributeNames: {
        '#status': 'status'
      },
      ExpressionAttributeValues: {
        ':status': status
      },
      ReturnValues: 'ALL_NEW'
    }).promise();

    res.json({
      message: 'Booking updated successfully',
      booking: result.Attributes
    });
  } catch (error) {
    console.error('Update booking error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete booking (Admin only)
router.delete('/:bookingId', authenticateToken, authenticateAdmin, async (req, res) => {
  try {
    const { bookingId } = req.params;

    // Get booking to restore seats
    const bookingResult = await dynamodb.get({
      TableName: TABLES.BOOKINGS,
      Key: { bookingId }
    }).promise();

    if (!bookingResult.Item) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    const booking = bookingResult.Item;

    // Delete booking
    await dynamodb.delete({
      TableName: TABLES.BOOKINGS,
      Key: { bookingId }
    }).promise();

    // Restore seats in flight
    await dynamodb.update({
      TableName: TABLES.FLIGHTS,
      Key: { flightId: booking.flightId },
      UpdateExpression: 'SET availableSeats = availableSeats + :seats',
      ExpressionAttributeValues: {
        ':seats': booking.numberOfSeats
      }
    }).promise();

    res.json({
      message: 'Booking deleted successfully'
    });
  } catch (error) {
    console.error('Delete booking error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;

