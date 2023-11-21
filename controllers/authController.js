const bcrypt = require("bcrypt");

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if email and password are provided
    if (!email || !password) {
      return res
        .status(400)
        .json({ error: "Email and password are required." });
    }

    // Fetch user by email
    const user = await getUserByEmail(email);

    // Check if user exists
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password." });
    }

    // Compare hashed password
    const passwordMatch = await bcrypt.compare(password, user.pwd);
    if (!passwordMatch) {
      return res.status(401).json({ error: "Invalid email or password." });
    }

    // User authentication successful
    const userData = {
      id: user.id,
      name: user.name,
      email: user.email,
      isAdmin: user.admin === 1,
    };

    res.json({ message: "Login successful", user: userData });
  } catch (error) {
    console.error("Error in loginUser:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

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

module.exports = {
  loginUser,
};
