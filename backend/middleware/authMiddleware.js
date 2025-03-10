const jwt = require("jsonwebtoken");

const protect = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); 
    req.user = decoded;
    next();
    
  } catch (err) {
    console.error("Token is not valid:", err);
    res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = { protect };
