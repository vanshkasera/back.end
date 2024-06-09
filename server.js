const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/userRoutes');
const pdfRoutes = require('./routes/pdfRoutes');

dotenv.config();

const app = express();
const Db = process.env.Db;

// Middleware
app.use(bodyParser.json());

// Connect to MongoDBs
mongoose.connect(Db)
.then(()=>{
    console.log("Database Connection Successfully!!")
})
.catch((error)=>{
    console.log(error);
})
// Define a schema and model for resume
const resumeSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  education: String,
  experience: String,
  skills: String,
});

const Resume = mongoose.model('Resume', resumeSchema);

// Routes

app.use('/api/users', userRoutes);

app.get('/api/resumes', async (req, res) => {
  const resumes = await Resume.find();
  res.json(resumes);
});

app.post('/api/resumes', async (req, res) => {
  const newResume = new Resume(req.body);
  await newResume.save();
  res.json(newResume);
});

app.put('/api/resumes/:id', async (req, res) => {
  const updatedResume = await Resume.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updatedResume);
});

app.delete('/api/resumes/:id', async (req, res) => {
  await Resume.findByIdAndDelete(req.params.id);
  res.json({ message: 'Resume deleted' });
});

// html 2 pdf
app.use('/api/pdf', pdfRoutes);

app.use('/pdfs', express.static(path.join(__dirname, 'pdfs')));


// Start the server
app.listen(5000, () => {
  console.log('Server is running on port 5000');
});
