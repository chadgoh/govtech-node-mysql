const database = require("../../database");
const Teacher = database.teachers;
const teacherService = require("../repositories/teacher.repository.js");
exports.createTeacher = (req, res) => {
  if (!req.body.email || !req.body.email.includes("@")) {
    res.status(400).send({
      message: "Email cannot be empty or invalid",
    });
  }

  const teacher = {
    email: req.body.email,
  };

  Teacher.create(teacher)
    .then((data) => {
      res.status(201).send({ message: "Teacher Successfully Created" });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Internal Server Error occured when creating teacher.",
      });
    });
};

exports.findAll = (req, res) => {
  console.log("Finding all teachers");
  Teacher.findAll()
    .then((data) => {
      res.status(200).send(data.map((teacher) => teacher["email"]));
    })
    .catch((err) => {
      console.log(err);
      res.status(500);
    });
};

exports.findTeacherByEmail = async (req, res) => {
  if (req === null || req.body === null) {
    res.status(400).send({
      message: "Invalid Request.",
    });
  }
  const email = req.body.email;

  try {
    const result = await teacherService.findTeacherByEmail(email);
    console.log(result);
    if (result) {
      res.send(result);
    } else {
      res
        .status(404)
        .send({ message: "Cannot find any teacher with the given email." });
    }
  } catch (error) {
    res.status(500).send({
      message:
        "Internal Server Error when trying to find teacher with the given email.",
    });
  }
};

exports.delete = (req, res) => {
  const email = req.body.email;
  Teacher.destroy({
    where: { email: email },
  })
    .then((data) => {
      if (data == 1) {
        res.status(200).send({
          message: "Teacher successfully deleted.",
        });
      } else {
        res.status(400).send({
          message: `Cannot delete Teacher with email=${email}`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: `Cannot delete Teacher with email=${email}`,
      });
    });
};
