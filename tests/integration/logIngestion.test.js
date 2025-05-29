const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Mock database path and log directory
const dbPath = './test.db';
const logDirectory = './test-logs';
process.env.DATABASE_PATH = dbPath;
process.env.LOG_DIRECTORY = logDirectory;

// Create the test log directory if it doesn't exist
if (!fs.existsSync(logDirectory)) {
    fs.mkdirSync(logDirectory);
}

// Create a sample log file
fs.writeFileSync(`${logDirectory}/test.log`, '2024-01-01 10:00:00 - INFO: Test log message', 'utf-8');

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

// Include routes after initializing the database
require('../../src/server');

describe('Log Ingestion', () => {
    it('should ingest logs successfully', (done) => {
        request(app)
            .post('/ingest-logs')
            .expect(200)
            .end((err, res) => {
                if (err) return done(err);
                expect(res.body.message).toBe('Logs ingested successfully');
                // Verify that the log entry was inserted into the database
                db.get("SELECT COUNT(*) AS count FROM logs", (err, row) => {
                    if (err) return done(err);
                    expect(row.count).toBeGreaterThan(0);
                    done();
                });
            });
    });

    afterAll((done) => {
        // Clean up: Close the database connection and remove the test database file
        db.close((err) => {
            if (err) {
                console.error('Error closing database:', err.message);
            }
            fs.unlinkSync(dbPath);
            // Clean up: Remove test log directory
            fs.rmdirSync(logDirectory, { recursive: true });
            done();
        });
    });
});