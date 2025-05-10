import express from 'express';
import cors from 'cors';
import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';

const app = express();
const PORT = process.env.PORT || 3000;

// Set up lowdb with JSON file
const adapter = new JSONFile('db.json');
const db = new Low(adapter);

// Read the data file (or create it if not exists)
await db.read();

// If the file is empty, initialize with default structure
if (!db.data) {
  db.data = { musicData: {} };
  await db.write(); // Save it
}

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get('/', (req, res) => {
  res.send('Backend is up and running');
});

// Save/update music data
app.post('/update', async (req, res) => {
  db.data.musicData = req.body;
  await db.write();
  res.json({ message: 'Music data saved!' });
});

// Serve music data
app.get('/music', (req, res) => {
  res.json(db.data.musicData);
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
