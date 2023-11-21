const path = require("path");
const sqlite3 = require("sqlite3").verbose();

const shuffleUsersToTeams = async () => {
  // Set the path to the SQLite database file
  const dbPath = path.join(__dirname, "../database/database.db");

  // Create or open the SQLite database instance
  const db = new sqlite3.Database(dbPath);

  try {
    // Fetch users without a team
    const usersWithoutTeam = await new Promise((resolve, reject) => {
      const query = "SELECT * FROM users WHERE team = 0";
      db.all(query, [], (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });

    // Fetch team IDs from the teams table
    const teamIds = await new Promise((resolve, reject) => {
      const query = "SELECT id FROM teams";
      db.all(query, [], (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows.map((row) => row.id));
        }
      });
    });

    // Shuffle team IDs
    const shuffledTeamIds = shuffleArray(teamIds);

    // Shuffle users to teams
    for (let i = 0; i < usersWithoutTeam.length; i++) {
      const userId = usersWithoutTeam[i].id;
      const teamId = shuffledTeamIds[i % shuffledTeamIds.length];

      // Update the user's team in the database
      await new Promise((resolve, reject) => {
        const updateQuery = "UPDATE users SET team = ? WHERE id = ?";
        db.run(updateQuery, [teamId, userId], async (err) => {
          if (err) {
            reject(err);
          } else {
            // Insert a record into user_team table
            const insertQuery =
              "INSERT INTO user_team (user_id, team_id) VALUES (?, ?)";
            db.run(insertQuery, [userId, teamId], (err) => {
              if (err) {
                reject(err);
              } else {
                resolve();
              }
            });
          }
        });
      });
    }

    console.log("Users shuffled to teams successfully");
  } catch (error) {
    console.error("Error shuffling users to teams:", error);
  } finally {
    // Close the database connection
    db.close();
  }
};

// Helper function to shuffle an array
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

module.exports = {
  shuffleUsersToTeams,
};
