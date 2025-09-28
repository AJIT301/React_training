import express from 'express';
import fetch from 'node-fetch'; // only if Node < 20
import cors from 'cors';

const app = express();
const PORT = 3001;

app.use(cors());

app.get('/steamconfig', async (req, res) => {
    try {
        const response = await fetch('https://api.steampowered.com/ISteamApps/GetSDRConfig/v1/?appid=730');
        if (!response.ok) {
            throw new Error(`Steam API error: ${response.status}`);
        }
        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});