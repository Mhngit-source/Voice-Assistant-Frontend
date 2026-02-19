// Authentication middleware
export const authenticate = (req, res, next) => {
  // In a real app, you would verify JWT token here
  // For now, we'll use a simple user ID from header
  const userId = req.headers['x-user-id'] || req.query.userId;
  
  if (!userId) {
    return res.status(401).json({ 
      success: false, 
      error: 'Authentication required' 
    });
  }
  
  req.user = { id: userId };
  next();
};