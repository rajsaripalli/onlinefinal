const AWS = require('aws-sdk');

// Configure AWS
AWS.config.update({
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

const dynamodb = new AWS.DynamoDB.DocumentClient();

// Table names
const TABLES = {
  USERS: 'yougo-users',
  FLIGHTS: 'yougo-flights',
  BOOKINGS: 'yougo-bookings'
};

// Helper function to ensure table exists (for development)
const ensureTableExists = async (tableName, keySchema) => {
  const dynamodbService = new AWS.DynamoDB();
  
  try {
    await dynamodbService.describeTable({ TableName: tableName }).promise();
    console.log(`Table ${tableName} already exists`);
  } catch (error) {
    if (error.code === 'ResourceNotFoundException') {
      console.log(`Creating table ${tableName}...`);
      const params = {
        TableName: tableName,
        KeySchema: keySchema,
        AttributeDefinitions: [
          { AttributeName: keySchema[0].AttributeName, AttributeType: 'S' }
        ],
        BillingMode: 'PAY_PER_REQUEST'
      };
      
      try {
        await dynamodbService.createTable(params).promise();
        console.log(`Table ${tableName} created successfully`);
      } catch (createError) {
        console.error(`Error creating table ${tableName}:`, createError);
      }
    }
  }
};

// Initialize tables
const initializeTables = async () => {
  await ensureTableExists(TABLES.USERS, [{ AttributeName: 'email', KeyType: 'HASH' }]);
  await ensureTableExists(TABLES.FLIGHTS, [{ AttributeName: 'flightId', KeyType: 'HASH' }]);
  await ensureTableExists(TABLES.BOOKINGS, [{ AttributeName: 'bookingId', KeyType: 'HASH' }]);
};

module.exports = {
  dynamodb,
  TABLES,
  initializeTables
};

