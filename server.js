const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Schema & Model
const Appointment = mongoose.model('Appointment', {
  patientName: String,
  doctorName: String,
  date: String,
  time: String
});

// Root route
app.get('/', (req, res) => {
  res.send('API is working');
});

// Get all appointments
app.get('/appointments', async (req, res) => {
  const appointments = await Appointment.find();
  res.json(appointments);
});

// Create appointment
app.post('/appointments', async (req, res) => {
  const { patientName, doctorName, date, time } = req.body;
  const newAppointment = new Appointment({ patientName, doctorName, date, time });
  await newAppointment.save();
  res.json({ success: true, data: newAppointment });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});