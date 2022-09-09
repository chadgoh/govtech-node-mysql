const express = require("express");
const cors = require("cors");
const app = express();
const database = require("./app/models");
const morgan = require("morgan");

var corsConfig = {
  origin: "http://localhost:3000",
};

app.use(cors(corsConfig));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan("tiny"));

app.get("/", (req, res) => {
  res.json({ message: "hello world" });
});

app.post("/testpost", (req, res) => {
  console.log(req);
  res.json(req.body);
});

database.sequelize
  .sync({ force: true })
  .then(() => {
    console.log("Synced DB");
  })
  .catch((err) => {
    console.log("Failed to sync the database: " + err.message);
  });

require("./app/routes/teacher.routes")(app);
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}`);
});
