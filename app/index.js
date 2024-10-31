const express = require("express");
const mysql = require("mysql");
const app = express();
const port = 3000;

const dbConfig = {
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
};

let db;

function handleDisconnect() {
  db = mysql.createConnection(dbConfig);

  db.connect((err) => {
    if (err) {
      console.error("Error connecting to MySQL:", err);
      setTimeout(handleDisconnect, 2000);
    } else {
      console.log("Connected to MySQL");
    }
  });

  db.on("error", (err) => {
    console.error("MySQL error:", err);
    if (err.code === "PROTOCOL_CONNECTION_LOST") {
      handleDisconnect();
    }
  });
}

handleDisconnect();

app.get("/", (req, res) => {
  const name = "Full Cycle Rocks!";

  db.query("INSERT INTO people (name) VALUES (?)", [name], (err) => {
    if (err) {
      console.error("Error inserting name:", err);
      return res.status(500).send("Error inserting name");
    }

    db.query("SELECT name FROM people", (err, results) => {
      if (err) {
        console.error("Error fetching names:", err);
        return res.status(500).send("Error fetching names");
      }

      const namesList = results.map((row) => row.name).join("<br>");
      res.send(`<h1>${name}</h1><br>${namesList}`);
    });
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
