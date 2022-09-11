const express = require("express");
const cors = require("cors");
const app = express();
const database = require("./app/database");
const morgan = require("morgan");

var corsConfig = {
  origin: "http://localhost:3000",
};
app.use(cors(corsConfig));
const jsonOnlyURIs = [
  "/api/register",
  "/api/suspend",
  "/api/retrievefornotifications",
];

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(function (req, res, next) {
  if (jsonOnlyURIs.includes(req.url)) {
    if (req.headers["content-type"] != "application/json") {
      res.status(415).send({
        message: "Unsupported media type. Only application/json allowed",
      });
    }
  }
  next();
});

app.use(morgan("tiny"));

database.sequelize
  .sync({ force: false })
  .then(() => {
    console.log("Synced DB");
  })
  .catch((err) => {
    console.log("Failed to sync the database: " + err.message);
  });

require("./app/teacher/routes/teacher.routes.js")(app);
require("./app/student/routes/student.routes.js")(app);
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}`);
});
