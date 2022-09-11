const database = require("../../database");
const Teacher = database.teachers;

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
      res.send(data);
    })
    .catch((err) => {
      console.log(err);
      res.status(500);
    });
};

exports.findTeacherById = (req, res) => {
  if (req === null || req.body === null) {
    res.status(400).send({
      message: "Invalid Request.",
    });
  }
  const id = req.body.id;
  Teacher.findByPk(id)
    .then((data) => {
      if (data) {
        res.send(data);
      } else {
        res
          .status(404)
          .send({ message: "Cannot find any teacher with the given email." });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message:
          "Internal Server Error when trying to find teacher with the given email.",
      });
    });
};

exports.updateTeacher = (req, res) => {
  const { id, email } = req.body;

  Teacher.update(
    { email: email },
    {
      where: { staffId: id },
    }
  )
    .then((data) => {
      console.log(data);
      if (data[0] === 1) {
        res.status(200).send({
          message: "Teacher successfully updated.",
        });
      } else {
        res.send({
          message: `Cannot update Teacher with id=${id}`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating teacher.",
      });
    });
};

exports.delete = (req, res) => {
  const id = req.params.id;
  Teacher.destroy({
    where: { id: id },
  })
    .then((data) => {
      if (data[0] === 1) {
        res.status(200).send({
          message: "Teacher successfully deleted.",
        });
      } else {
        res.send({
          message: `Cannot delete Teacher with id=${id}`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: `Cannot delete Teacher with id=${id}`,
      });
    });
};
