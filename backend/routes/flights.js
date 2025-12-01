const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { dynamodb, TABLES } = require('../config/dynamodb');
const { authenticateToken, authenticateAdmin } = require('../middleware/auth');

const router = express.Router();

// Get all flights (accessible to all authenticated users)
router.get('/', authenticateToken, async (req, res) => {
  try {
    const result = await dynamodb.scan({
      TableName: TABLES.FLIGHTS
    }).promise();

    res.json({
      flights: result.Items || []
    });
  } catch (error) {
    console.error('Get flights error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get single flight by ID
router.get('/:flightId', authenticateToken, async (req, res) => {
  try {
    const { flightId } = req.params;

    const result = await dynamodb.get({
      TableName: TABLES.FLIGHTS,
      Key: { flightId }
    }).promise();

    if (!result.Item) {
      return res.status(404).json({ error: 'Flight not found' });
    }

    res.json({ flight: result.Item });
  } catch (error) {
    console.error('Get flight error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Add flight (Admin only)
router.post('/', authenticateToken, authenticateAdmin, async (req, res) => {
  try {
    const { flightNumber, airline, departure, destination, departureTime, arrivalTime, price, seats } = req.body;

    if (!flightNumber || !airline || !departure || !destination || !departureTime || !arrivalTime || !price || !seats) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const flight = {
      flightId: uuidv4(),
      flightNumber,
      airline,
      departure,
      destination,
      departureTime,
      arrivalTime,
      price: parseFloat(price),
      seats: parseInt(seats),
      availableSeats: parseInt(seats),
      createdAt: new Date().toISOString()
    };

    await dynamodb.put({
      TableName: TABLES.FLIGHTS,
      Item: flight
    }).promise();

    res.status(201).json({
      message: 'Flight added successfully',
      flight
    });
  } catch (error) {
    console.error('Add flight error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update flight (Admin only)
router.put('/:flightId', authenticateToken, authenticateAdmin, async (req, res) => {
  try {
    const { flightId } = req.params;
    const { flightNumber, airline, departure, destination, departureTime, arrivalTime, price, seats } = req.body;

    // Check if flight exists
    const existingFlight = await dynamodb.get({
      TableName: TABLES.FLIGHTS,
      Key: { flightId }
    }).promise();

    if (!existingFlight.Item) {
      return res.status(404).json({ error: 'Flight not found' });
    }

    const updateExpression = [];
    const expressionAttributeNames = {};
    const expressionAttributeValues = {};

    if (flightNumber) {
      updateExpression.push('#flightNumber = :flightNumber');
      expressionAttributeNames['#flightNumber'] = 'flightNumber';
      expressionAttributeValues[':flightNumber'] = flightNumber;
    }
    if (airline) {
      updateExpression.push('#airline = :airline');
      expressionAttributeNames['#airline'] = 'airline';
      expressionAttributeValues[':airline'] = airline;
    }
    if (departure) {
      updateExpression.push('#departure = :departure');
      expressionAttributeNames['#departure'] = 'departure';
      expressionAttributeValues[':departure'] = departure;
    }
    if (destination) {
      updateExpression.push('#destination = :destination');
      expressionAttributeNames['#destination'] = 'destination';
      expressionAttributeValues[':destination'] = destination;
    }
    if (departureTime) {
      updateExpression.push('#departureTime = :departureTime');
      expressionAttributeNames['#departureTime'] = 'departureTime';
      expressionAttributeValues[':departureTime'] = departureTime;
    }
    if (arrivalTime) {
      updateExpression.push('#arrivalTime = :arrivalTime');
      expressionAttributeNames['#arrivalTime'] = 'arrivalTime';
      expressionAttributeValues[':arrivalTime'] = arrivalTime;
    }
    if (price) {
      updateExpression.push('#price = :price');
      expressionAttributeNames['#price'] = 'price';
      expressionAttributeValues[':price'] = parseFloat(price);
    }
    if (seats) {
      updateExpression.push('#seats = :seats');
      expressionAttributeNames['#seats'] = 'seats';
      expressionAttributeValues[':seats'] = parseInt(seats);
    }

    if (updateExpression.length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }

    const result = await dynamodb.update({
      TableName: TABLES.FLIGHTS,
      Key: { flightId },
      UpdateExpression: `SET ${updateExpression.join(', ')}`,
      ExpressionAttributeNames: expressionAttributeNames,
      ExpressionAttributeValues: expressionAttributeValues,
      ReturnValues: 'ALL_NEW'
    }).promise();

    res.json({
      message: 'Flight updated successfully',
      flight: result.Attributes
    });
  } catch (error) {
    console.error('Update flight error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete flight (Admin only)
router.delete('/:flightId', authenticateToken, authenticateAdmin, async (req, res) => {
  try {
    const { flightId } = req.params;

    // Check if flight exists
    const existingFlight = await dynamodb.get({
      TableName: TABLES.FLIGHTS,
      Key: { flightId }
    }).promise();

    if (!existingFlight.Item) {
      return res.status(404).json({ error: 'Flight not found' });
    }

    await dynamodb.delete({
      TableName: TABLES.FLIGHTS,
      Key: { flightId }
    }).promise();

    res.json({
      message: 'Flight deleted successfully'
    });
  } catch (error) {
    console.error('Delete flight error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;

