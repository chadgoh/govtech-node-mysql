const database = require("../models");
const Teacher = database.teachers;
const Student = database.students;
const Student_Teacher = database.student_teacher;
const { Op } = require("sequelize");
const { sequelize } = require("../models");

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

exports.registerStudent = async (req, res) => {
  const { teacher: teacherEmail, students: studentEmails } = req.body;

  const foundTeacher = await Teacher.findOne({
    where: { email: teacherEmail },
  });

  if (foundTeacher == null) {
    res.status(400).send("Sorry, we cannot find a teacher with that email.");
    return null;
  }

  studentEmails.forEach((email) => {
    Student.findOrCreate({ where: { email: email }, raw: true });
  });

  await foundTeacher.addStudents(studentEmails);

  res.status(204).send();
};

exports.commonStudents = async (req, res) => {
  const teachers = req.query.teacher;

  const students = await Student_Teacher.findAll({
    attributes: ["studentEmail"],
    where: {
      teacherEmail: {
        [Op.or]: teachers,
      },
    },
    raw: true,
    group: "studentEmail",
  });
  res
    .status(200)
    .json({ students: students.map((student) => student.studentEmail) });
};

exports.suspendStudent = (req, res) => {
  if (req.body == null || req.body.student == null) {
    res
      .status(400)
      .send({ message: "Invalid Request. Make sure you specify a student." });
  }

  const studentEmail = req.body.student;

  Student.update({ isSuspended: true }, { where: { email: studentEmail } })
    .then((data) => {
      if (data[0] == 1) {
        console.log(data);
        res.status(204).send();
      } else {
        res.status(500).send({
          message: `Cannot suspend student with email: ${studentEmail}`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Internal Server Error when trying to suspend student.",
      });
    });
  return null;
};

exports.unsuspendStudent = (req, res) => {
  if (req.body == null || req.body.student == null) {
    res
      .status(400)
      .send({ message: "Invalid Request. Make sure you specify a student." });
  }

  const studentEmail = req.body.student;

  Student.update({ isSuspended: false }, { where: { email: studentEmail } })
    .then((data) => {
      if (data[0] == 1) {
        console.log(data);
        res.status(204).send();
      } else {
        res.status(500).send({
          message: `Cannot unsuspend student with email: ${studentEmail}`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Internal Server Error when trying to unsuspend student.",
      });
    });
  return null;
};

exports.retrieveForNotifications = async (req, res) => {
  if (req.body == null) {
    res.send(404).send({ message: "Invalid Request." });
  }

  const teacherEmail = req.body.teacher;
  const splitStudents = req.body.notification.split("@");
  const notificationMessage = splitStudents.shift();
  const taggedStudents = [];

  for (let index = 0; index < splitStudents.length; index += 2) {
    const element = splitStudents[index]
      .concat("@" + splitStudents[index + 1])
      .trim();
    taggedStudents.push(element);
  }
  console.log(taggedStudents);

  const result = await Student_Teacher.findAll({
    attributes: [],
    include: {
      model: Student,
      required: true,
      where: { isSuspended: false },
      attributes: ["email"],
    },
    where: {
      [Op.or]: [
        { teacherEmail: teacherEmail },
        { studentEmail: taggedStudents },
      ],
    },
    raw: true,
  });
  console.log(result);

  res.status(204).send();
};
