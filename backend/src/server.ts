import app from "./app";
import dotenv from "dotenv";
import cors from 'cors';
import axios from 'axios';

// Load environment variables
dotenv.config();

// Set the timezone
process.env.TZ = process.env.TZ || 'Africa/Nairobi';

const PORT = process.env.PORT || 3000;
app.use(cors({
  origin: 'http://localhost:4200', 
  methods: ['GET', 'POST', 'PUT', 'DELETE'], 
  allowedHeaders: ['Content-Type', 'Authorization'] 
}));

// Log the server's current time when starting
console.log(`Server starting at: ${new Date().toLocaleString('en-US', { timeZone: process.env.TZ })}`);

// Keep-alive cron job function
const keepServerAlive = async () => {
  // Use the actual Render URL instead of localhost
  const baseUrl = process.env.NODE_ENV === 'production' 
    ? 'https://agro-connect-ke.onrender.com' 
    : `http://localhost:${PORT}`;

  try {
    // Try to call the health endpoint
    const response = await axios.get(`${baseUrl}/health`, {
      timeout: 30000,
      headers: {
        'User-Agent': 'Keep-Alive-Bot'
      }
    });
    console.log(`🏥 Health check: ${response.status} - ${new Date().toISOString()}`);
  } catch (error) {
    // If health fails, try the products endpoint
    try {
      const response = await axios.get(`${baseUrl}/api/product`, {
        timeout: 30000,
        headers: {
          'User-Agent': 'Keep-Alive-Bot'
        }
      });
      console.log(`📦 Products check: ${response.status} - ${new Date().toISOString()}`);
    } catch (productError) {
      console.log(`❌ Keep-alive failed: ${new Date().toISOString()}`);
      console.error('Error details:', productError instanceof Error ? productError.message : String(productError));
    }
  }
};

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Server time: ${new Date().toLocaleString('en-US', { timeZone: process.env.TZ })}`);
  
  // Start keep-alive cron only in production (Render)
  if (process.env.NODE_ENV === 'production' || process.env.RENDER) {
    console.log('🚀 Starting keep-alive cron job...');
    console.log(`Will ping: https://agro-connect-ke.onrender.com/health`);
    
    // Run every 14 minutes (14 * 60 * 1000 = 840000 milliseconds)
    // Render spins down after 15 minutes of inactivity
    setInterval(keepServerAlive, 840000);
    
    // Initial call after 30 seconds to let server fully start
    setTimeout(keepServerAlive, 30000);
    
    console.log('⏰ Keep-alive cron started - pinging every 14 minutes');
  }
});

