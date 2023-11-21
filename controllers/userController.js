const sqlite3 = require("sqlite3").verbose();
const path = require("path");

// Set the path to the SQLite database file
const dbPath = path.join(__dirname, "../database/database.db");

// Create and export the SQLite database instance
const db = new sqlite3.Database(dbPath);

const addUser = async (req, res) => {
  try {
    const { name, email, pwd, isAdmin, team } = req.query;

    // Check if required fields are present
    if (!name || !pwd || !email) {
      return res
        .status(400)
        .json({ error: "Name, email, and password are required." });
    }

    // Check if the email already exists
    const existingUser = await new Promise((resolve, reject) => {
      const query = "SELECT * FROM users WHERE email = ?";
      db.get(query, [email], (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      });
    });

    if (existingUser) {
      return res.status(400).json({ error: "Email already exists" });
    }

    const isAdminValue = isAdmin ? 1 : 0;
    // Create user
    const createdUser = await new Promise((resolve, reject) => {
      const insertQuery = `
    INSERT INTO users (name, email, pwd, admin, created, updated, team)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

      db.run(
        insertQuery,
        [
          name,
          email,
          pwd,
          isAdminValue,
          new Date().toLocaleDateString("en-GB"),
          new Date().toLocaleDateString("en-GB"),
          team,
        ],
        function (err) {
          if (err) {
            reject(err);
          } else {
            resolve({ id: this.lastID });
          }
        }
      );
    });

    // If team is not empty, associate the user with the team
    if (team) {
      await new Promise((resolve, reject) => {
        const updateQuery = "UPDATE users SET team = ? WHERE id = ?";
        db.run(updateQuery, [team, createdUser.id], (err) => {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        });
      });
    }

    res
      .status(201)
      .json({ message: "User added successfully", user: createdUser });
  } catch (error) {
    console.error("Error in addUser:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const showAllUsers = async (req, res) => {
  try {
    const users = await new Promise((resolve, reject) => {
      const query = "SELECT * FROM users ORDER BY id ASC";
      db.all(query, [], (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });

    const formattedUsers = users.map((user) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      created: user.created,
      updated: user.updated,
      admin: user.admin,
      team: user.team,
    }));

    res.json(formattedUsers);
  } catch (error) {
    console.error("Error in showAllUsers:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const searchUser = async (req, res) => {
  console.log("searchUser requested");
  try {
    const { teamId } = req.query;

    // Find users in the specified team in the user_team table
    const userTeamRows = await new Promise((resolve, reject) => {
      const query = "SELECT * FROM user_team WHERE team_id = ?";
      db.all(query, [teamId], (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });

    // Get the user IDs from the user_team rows
    const userIds = userTeamRows.map((row) => row.user_id);

    // Find user details for the retrieved user IDs
    const users = await new Promise((resolve, reject) => {
      const userQuery = "SELECT * FROM users WHERE id IN (?)";
      const userIdsString = userIds.join(",");

      db.all(userQuery.replace("?", userIdsString), (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });

    const formattedUsers = users.map((user) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      created: user.created,
      updated: user.updated,
    }));

    res.json(formattedUsers);
  } catch (error) {
    console.error("Error in searchUser:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const updateUser = async (req, res) => {
  try {
    const { userId, name, email, isAdmin, team } = req.query;

    // Find the user by ID
    const user = await getUserById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Check if the new email already exists
    if (email !== null && email !== undefined && email !== user.email) {
      const existingUser = await getUserByEmail(email);
      if (existingUser) {
        return res.status(400).json({ error: "Email already exists" });
      }
    }

    // Prepare parameters for the update
    const updateParams = {
      name: name !== null && name !== undefined ? name : user.name,
      email: email !== null && email !== undefined ? email : user.email,
      isAdmin: isAdmin !== null && isAdmin !== undefined ? isAdmin : user.admin,
      team: team !== null && team !== undefined ? team : user.team,
      updated: new Date().getTime(),
    };

    // Update user information
    await updateUserInformation(userId, updateParams);

    res.json({ message: "User updated successfully" });
  } catch (error) {
    console.error("Error in updateUser:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Helper function to get user by ID
const getUserById = (userId) => {
  return new Promise((resolve, reject) => {
    const query = "SELECT * FROM users WHERE id = ?";
    db.get(query, [userId], (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(row);
      }
    });
  });
};

// Helper function to get user by email
const getUserByEmail = (email) => {
  return new Promise((resolve, reject) => {
    const query = "SELECT * FROM users WHERE email = ?";
    db.get(query, [email], (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(row);
      }
    });
  });
};

// Helper function to update user information
const updateUserInformation = (userId, updateParams) => {
  return new Promise((resolve, reject) => {
    const updateQuery =
      "UPDATE users SET name = ?, email = ?, admin = ?, team = ?, updated = ? WHERE id = ?";
    db.run(
      updateQuery,
      [
        updateParams.name,
        updateParams.email,
        updateParams.isAdmin,
        updateParams.team,
        updateParams.updated,
        userId,
      ],
      function (err) {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      }
    );
  });
};

const deleteUser = async (req, res) => {
  try {
    const { userId } = req.query;

    // Find the user by ID
    const user = await new Promise((resolve, reject) => {
      const query = "SELECT * FROM users WHERE id = ?";
      db.get(query, [userId], (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      });
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Delete the user
    await new Promise((resolve, reject) => {
      const deleteQuery = "DELETE FROM users WHERE id = ?";
      db.run(deleteQuery, [userId], (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });

    // Delete the corresponding row from the user_team table
    await new Promise((resolve, reject) => {
      const deleteUserTeamQuery = "DELETE FROM user_team WHERE user_id = ?";
      db.run(deleteUserTeamQuery, [userId], (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error in deleteUser:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  addUser,
  showAllUsers,
  searchUser,
  updateUser,
  deleteUser,
};
