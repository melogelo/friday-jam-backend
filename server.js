import express from 'express';
import cors from 'cors';
import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';

const app = express();
const PORT = process.env.PORT || 3000;

// Use /tmp for writable file system on Render
const adapter = new JSONFile('/tmp/db.json');
const db = new Low(adapter);

// Middleware
app.use(cors());
app.use(express.json());

// Initialize DB with defaults
async function initDB() {
  await db.read();
  db.data ||= { musicData: {} };
  await db.write();
}
await initDB();

// Routes
app.get('/', (req, res) => {
  res.send('Admin panel is running!');
});

app.post('/update', async (req, res) => {
  db.data.musicData = req.body;
  await db.write();
  res.json({ message: 'Music data saved!' });
});

app.get('/music', (req, res) => {
  res.json(db.data.musicData);
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
