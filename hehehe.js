/*const express = require('express');
const app = express();
var sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database("./database.db")

app.use(express.json());

app.listen(3000, () => {
    console.log("Server is listening on port 3000");
});

db.serialize(() => {
    db.run(`DROP TABLE IF EXISTS user_team`);
    db.run(`DROP TABLE IF EXISTS users`);
    db.run(`DROP TABLE IF EXISTS teams`);

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
    team INTEGER,
    FOREIGN KEY (team) REFERENCES teams (id) ON DELETE SET NULL ON UPDATE CASCADE
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS user_team(
    user_id INTEGER,
    team_id INTEGER, 

    PRIMARY KEY (user_id, team_id),
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE SET NULL ON UPDATE CASCADE,
    FOREIGN KEY (team_id) REFERENCES teams (id) ON DELETE SET NULL ON UPDATE CASCADE
    )`)

    db.run(`INSERT INTO teams (id, name) VALUES
    (1, "renard"),
    (2, "poulet"),
    (3, "vipere")
    `);

    db.run(``)
});


const isAdmin = (username, password, callback) => {
    const query = `SELECT admin FROM users WHERE name=? AND pwd=?`;

    db.get(query, [username, password], (err, result) => {
        if (err) {
            callback(err);
        } else {
            if (!result) {
                callback(null, false); // User not found
            } else {
                callback(null, result.admin === 1); // Check if the user is an admin
            }
        }
    });
};

const authenticateUser = (username, password, callback) => {
    const query = `SELECT * FROM users WHERE name=? AND pwd=?`;

    db.get(query, [username, password], (err, user) => {
        if (err) {
            callback(err);
        } else {
            callback(null, user);
        }
    });
};


const addUser = (user, callback) => {
    const query = `INSERT INTO users (name, pwd, email, admin, created, team) VALUES (?, ?, ?, ?, ?, ?)`;

    db.run(query, [user.name, user.pwd, user.email, user.admin, Date.now(), user.team], function (err) {
        if (err) {
            callback(err);
        } else {
            callback(null, this.lastID); // Return the ID of the newly inserted user
        }
    });
};

const getAllUsers = (callback) => {
    const query = `SELECT * FROM users`;

    db.all(query, [], (err, users) => {
        if (err) {
            callback(err);
        } else {
            callback(null, users);
        }
    });
};



/*
const isAdmin = (req, res, next) => {
    const username = req.query.name;
    const pwd = req.query.pwd;

    console.log(username)
    console.log(pwd)

    let querry = (`SELECT admin FROM users WHERE name=${username} AND pwd=${pwd}`);

    db.all(querry, (err, result) => {
        if (err) {
            res.status(400).send("Error connecting to the server");
        }
        else {
            if (result.length() < 1) res.status(404).send("User not Found");
            else if (result == 0) res.status(401).send("You're not an Admin");
            else next()
        }
    })
}

app.get("/", isAdmin, (req, res) => {
    console.log("yes") 
})

/*
const authentication=(req, res, next)=>{
    const username=req.query.name;
    const pwd=req.query.pwd;


}

let querry = `SELECT * FROM users`;
db.all(querry, [], (err, row) => {
    if (err) {
        console.log('eerror connecting to the database');
    } else {
        if (!row) {
            console.log('no results found.');
        } else {
            console.log(row);
        }
    }
});
*/

db.close();