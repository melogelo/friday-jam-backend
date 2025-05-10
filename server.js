import express from 'express';
import cors from 'cors';
import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';

const app = express();
const PORT = process.env.PORT || 3000;

// Set up lowdb
const adapter = new JSONFile('db.json');
const db = new Low(adapter);

await db.read();
if (!db.data) {
  db.data = { musicData: {} };
  await db.write();
}

// Middleware
app.use(cors());
app.use(express.json());

// Test route
app.get('/', (req, res) => {
  res.send('Admin panel is running!');
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
  console.log(`Server is running at http://localhost:${PORT}`);
});
