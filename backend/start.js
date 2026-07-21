// Simple startup script to test database initialization
import { get } from './db.js';

async function testDatabase() {
  try {
    console.log('Testing database connection...');
    await get('SELECT 1');
    console.log('✓ Database connection successful!');
    
    // Import and start the server
    console.log('Starting server...');
    await import('./app.js');
  } catch (error) {
    console.error('✗ Error:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

testDatabase();

