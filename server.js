const express = require("express");
// const bodyParser = require("body-parser"); /* deprecated */
const cors = require("cors");

const app = express();

var corsOptions = {
  origin: "http://localhost:8081"
};

app.use(cors(corsOptions));

// serve the simple frontend UI
if (process.env.NODE_ENV !== "test") {
  app.use(express.static("public"));
}

// parse requests of content-type - application/json
app.use(express.json()); /* bodyParser.json() is deprecated */

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true })); /* bodyParser.urlencoded() is deprecated */

// simple route
app.get("/", (req, res) => {
  const acceptHeader = req.headers.accept || "";

  if (acceptHeader.includes("text/html")) {
    return res.sendFile(require("path").join(__dirname, "public", "index.html"));
  }

  return res.json({ message: "Welcome to bezkoder application." });
});

app.get("/tutorials", (req, res) => {
  res.status(200).json({ message: "Tutorials endpoint loaded successfully." });
});

require("./app/routes/tutorial.routes.js")(app);

module.exports = app;

// set port, listen for requests only when this file is run directly
if (require.main === module) {
  const PORT = process.env.PORT || 8080;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
  });
}
