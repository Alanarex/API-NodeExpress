const express = require("express");
const app = express();
const bodyParser = require("body-parser"); // Add this line
const db = require("./database/database.js");
const userRoutes = require("./routes/users");
const authRoutes = require("./routes/auth");
const path = require("path");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

app.use("/users/", userRoutes);
app.use("/auth/", authRoutes);


// Run the setup script before starting the server
require("./database/setup");
app.use(express.static(path.join(__dirname, "views")));

// Serve the login.html file when accessing the root route
app.get("/", (req, res) => {
  // Set content type to HTML
  res.setHeader("Content-Type", "text/html");

  // Send the login.html file
  res.sendFile(path.join(__dirname, "views", "auth", "login.html"), (err) => {
    // If an error occurs, log it and send an error response
    if (err) {
      console.error(err);
      res.status(500).send("Error occurred while loading login.html");
    }
  });
});

app.get("/addUser", (req, res) => {
  // Set content type to HTML
  res.setHeader("Content-Type", "text/html");

  // Send the searchUser.html file
  res.sendFile(path.join(__dirname, "views", "user", "addUser.html")),
    (err) => {
      // If an error occurs, log it and send an error response
      if (err) {
        console.error(err);
        res.status(500).send("Error occurred while loading addUser.html");
      }
    };
});

app.get("/showAllUsers", (req, res) => {
  // Set content type to HTML
  res.setHeader("Content-Type", "text/html");

  // Send the searchUser.html file
  res.sendFile(path.join(__dirname, "views", "user", "showAllUsers.html")),
    (err) => {
      // If an error occurs, log it and send an error response
      if (err) {
        console.error(err);
        res.status(500).send("Error occurred while loading showAllUsers.html");
      }
    };
});

app.get("/updateUser", (req, res) => {
  // Set content type to HTML
  res.setHeader("Content-Type", "text/html");

  // Send the searchUser.html file
  res.sendFile(path.join(__dirname, "views", "user", "updateUser.html")),
    (err) => {
      // If an error occurs, log it and send an error response
      if (err) {
        console.error(err);
        res.status(500).send("Error occurred while loading updateUser.html");
      }
    };
});

app.get("/deleteUser", (req, res) => {
  // Set content type to HTML
  res.setHeader("Content-Type", "text/html");

  // Send the searchUser.html file
  res.sendFile(path.join(__dirname, "views", "user", "deleteUser.html")),
    (err) => {
      // If an error occurs, log it and send an error response
      if (err) {
        console.error(err);
        res.status(500).send("Error occurred while loading deleteUser.html");
      }
    };
});

app.get("/searchUser", (req, res) => {
  // Set content type to HTML
  res.setHeader("Content-Type", "text/html");

  // Send the searchUser.html file
  res.sendFile(path.join(__dirname, "views", "user", "searchUser.html")),
    (err) => {
      // If an error occurs, log it and send an error response
      if (err) {
        console.error(err);
        res.status(500).send("Error occurred while loading searchUser.html");
      }
    };
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
