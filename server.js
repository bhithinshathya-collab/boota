const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;
const DATA_FILE = path.join(__dirname, 'apps.json');

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

function getSavedApps() {
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify([]));
  }
  return JSON.parse(fs.readFileSync(DATA_FILE));
}

app.get('/api/apps', (req, res) => res.json(getSavedApps()));

app.post('/api/apps', (req, res) => {
  const { title, url } = req.body;
  if (!title || !url) return res.status(400).json({ error: 'Missing title or URL' });

  const apps = getSavedApps();
  const newApp = { id: Date.now(), title, url };
  apps.push(newApp);
  fs.writeFileSync(DATA_FILE, JSON.stringify(apps, null, 2));
  res.json({ success: true, app: newApp });
});

app.listen(PORT, () => console.log(`Boota running on http://localhost:${PORT}`));
