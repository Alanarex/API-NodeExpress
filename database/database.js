const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Set the path to the SQLite database file
const dbPath = path.join(__dirname, 'database.db');

// Create and export the SQLite database instance
const db = new sqlite3.Database(dbPath);

module.exports = db;
