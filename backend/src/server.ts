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
  try {
    // Try to call the health endpoint
    const response = await axios.get(`http://localhost:${PORT}/health`, {
      timeout: 30000
    });
    console.log(`🏥 Health check: ${response.status} - ${new Date().toISOString()}`);
  } catch (error) {
    // If health fails, try the products endpoint
    try {
      const response = await axios.get(`http://localhost:${PORT}/api/product`, {
        timeout: 30000
      });
      console.log(`📦 Products check: ${response.status} - ${new Date().toISOString()}`);
    } catch (productError) {
      console.log(`❌ Keep-alive failed: ${new Date().toISOString()}`);
    }
  }
};

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`Server time: ${new Date().toLocaleString('en-US', { timeZone: process.env.TZ })}`);
  
  // Start keep-alive cron only in production (Render)
  if (process.env.NODE_ENV === 'production' || process.env.RENDER) {
    console.log('🚀 Starting keep-alive cron job...');
    
    // Run every 40 seconds (40000 milliseconds)
    setInterval(keepServerAlive, 40000);
    
    // Initial call after 10 seconds
    setTimeout(keepServerAlive, 10000);
    
    console.log('⏰ Keep-alive cron started - pinging every 40 seconds');
  }
});

