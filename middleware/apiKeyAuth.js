// Middleware to check for API key authorization
const apiKeyAuth = (req, res, next) => {
    const apiKey = req.headers['x-api-key']; // API key sent in request header
    const JWT_SECRET='your_secret_key';
    if (!apiKey) {
      return res.status(401).json({ message: 'API key is missing' });
    }
  
    // Check if the API key is correct
    if (apiKey !== JWT_SECRET) {
      return res.status(403).json({ message: 'Unauthorized: Invalid API key' });
    }
  
    // If API key is valid, proceed to the next middleware or route handler
    next();
  };
  
  module.exports = apiKeyAuth;
  