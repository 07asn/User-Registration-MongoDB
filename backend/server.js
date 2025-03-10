//--------------------
// Imports
//--------------------
const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const authRoutes = require("./routes/auth");
const cors = require('cors');


//--------------------
// Middlewares
//--------------------
dotenv.config();

const app = express();
app.use(express.json());
app.use(cookieParser());

const corsOptions = { origin: 'http://localhost:5176', credentials: true, };
app.use(cors(corsOptions));


//--------------------
// Routes
//--------------------
app.use("/api/auth", authRoutes);


//--------------------
// Connect DB
//--------------------
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB", err);
  });

  
//--------------------
// Connect Server
//--------------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
