const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const moment = require('moment');

const app = express();
const port = process.env.PORT || 3000;
const logDirectory = process.env.LOG_DIRECTORY || './logs';
const dbPath = process.env.DATABASE_PATH || './logs.db';

app.use(cors());
app.use(bodyParser.json());

// Initialize the database
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Database connection error:', err.message);
    }
    console.log('Connected to the database.');
});

db.serialize(() => {
    db.run("CREATE TABLE IF NOT EXISTS logs (id INTEGER PRIMARY KEY AUTOINCREMENT, timestamp TEXT, severity TEXT, message TEXT, source TEXT)");
});

// Helper function to parse log entries (very basic parsing)
function parseLogEntry(line) {
    try {
        const parts = line.split(' - ');
        const timestamp = parts[0];
        const severityAndMessage = parts[1].split(': ');
        const severity = severityAndMessage[0];
        const message = severityAndMessage[1];
        const source = 'Unknown';

        return { timestamp, severity, message, source };
    } catch (e) {
        console.error("Error parsing line: ", line, e);
        return null;
    }
}

// Endpoint to ingest log files
app.post('/ingest-logs', async (req, res) => {
    const logFiles = fs.readdirSync(logDirectory);

    for (const file of logFiles) {
        const filePath = `${logDirectory}/${file}`;
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        const lines = fileContent.split('\n');

        lines.forEach(line => {
            if (line) {
                const logEntry = parseLogEntry(line);
                if (logEntry) {
                    db.run("INSERT INTO logs (timestamp, severity, message, source) VALUES (?, ?, ?, ?)",
                        [logEntry.timestamp, logEntry.severity, logEntry.message, logEntry.source],
                        function (err) {
                            if (err) {
                                console.error('Database insert error:', err.message);
                            }
                        });
                }
            }
        });
    }
    res.send({ message: 'Logs ingested successfully' });
});

// Endpoint to get log statistics
app.get('/log-statistics', (req, res) => {
    db.all("SELECT severity, COUNT(*) as count FROM logs GROUP BY severity", [], (err, rows) => {
        if (err) {
            console.error('Database query error:', err.message);
            return res.status(500).json({ error: 'Failed to retrieve log statistics' });
        }
        res.json(rows);
    });
});

// Endpoint to get logs over time
app.get('/logs-over-time', (req, res) => {
    db.all("SELECT strftime('%Y-%m-%d', timestamp) AS log_date, COUNT(*) AS count FROM logs GROUP BY log_date ORDER BY log_date", [], (err, rows) => {
        if (err) {
            console.error('Database query error:', err.message);
            return res.status(500).json({ error: 'Failed to retrieve logs over time' });
        }
        res.json(rows);
    });
});


// Endpoint to get latest logs
app.get('/latest-logs', (req, res) => {
    db.all("SELECT * FROM logs ORDER BY id DESC LIMIT 100", [], (err, rows) => {
        if (err) {
            console.error('Database query error:', err.message);
            return res.status(500).json({ error: 'Failed to retrieve latest logs' });
        }
        res.json(rows);
    });
});


app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});