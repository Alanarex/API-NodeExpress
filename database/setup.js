// setup.js

const sqlite3 = require("sqlite3").verbose();
const path = require("path");

// Set the path to the SQLite database file
const dbPath = path.join(__dirname, "database.db");

// Create and export the SQLite database instance
const db = new sqlite3.Database(dbPath);
const shuffleController = require("../controllers/shuffleController"); // Import the teamController

db.serialize(() => {
  // Drop existing tables
  db.run(`DROP TABLE IF EXISTS user_team`);
  db.run(`DROP TABLE IF EXISTS users`);
  db.run(`DROP TABLE IF EXISTS teams`);

  // Create new tables
  db.run(`CREATE TABLE IF NOT EXISTS teams (
        id INTEGER PRIMARY KEY,
        name TEXT NOT NULL
    )`);

  db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY,
        name TEXT NOT NULL,
        pwd VARCHAR(256) NOT NULL,
        email TEXT NOT NULL,
        admin INTEGER NOT NULL,
        created BIGINT NOT NULL,
        updated BIGINT,
        team INTEGER NOT NULL,
        FOREIGN KEY (team) REFERENCES teams (id) ON DELETE SET NULL ON UPDATE CASCADE
    )`);

  db.run(`CREATE TABLE IF NOT EXISTS user_team (
        user_id INTEGER,
        team_id INTEGER, 

        PRIMARY KEY (user_id, team_id),
        FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE SET NULL ON UPDATE CASCADE,
        FOREIGN KEY (team_id) REFERENCES teams (id) ON DELETE SET NULL ON UPDATE CASCADE
    )`);

  // Insert initial data into the users table
  db.run(`INSERT INTO users (id, name, pwd, email, admin, created, updated, team) VALUES
        (1, 'Rachèle', 'wcyt', 'gbaumber0@vistaprint.com', 1, '2/7/2023', '8/16/2023', 0),
        (2, 'Aloïs', 'iqow$4%', 'chugnin1@time.com', 1, '11/29/2022', '4/30/2023', 0),
        (3, 'Jú', 'oxnp=', 'dwisham2@blogtalkradio.com', 0, '12/31/2022', '7/31/2023', 0),
        (4, 'Eloïse', 'rnubPZ7', 'fmoore3@ifeng.com', 1, '4/29/2023', '9/28/2023', 0),
        (5, 'Fèi', 'fmeb', 'umilbourne4@yandex.ru', 0, '9/10/2023', '2/19/2023', 0),
        (6, 'Aimée', 'zchhpFf', 'hpratte5@github.io', 0, '2/8/2023', '11/10/2023', 0),
        (7, 'Marlène', 'feddhA<', 'dchaves6@slate.com', 1, '11/26/2022', '5/6/2023', 0),
        (8, 'Méthode', 'rpws', 'jpestell7@geocities.jp', 0, '3/5/2023', '2/22/2023', 0),
        (9, 'Andrée', 'eiea', 'mkelloway8@cbc.ca', 0, '12/23/2022', '4/25/2023', 0),
        (10, 'Méryl', 'zwipn', 'hhamnett9@etsy.com', 1, '11/27/2022', '4/22/2023', 0)
    `);

  // Insert initial data into the teams table
  db.run(`INSERT INTO teams (id, name) VALUES
        (1, "fox"),
        (2, "chicken"),
        (3, "viper")
    `);
  shuffleController.shuffleUsersToTeams()
  console.log("Database setup completed.");

  // Close the database connection
  db.close();
});
