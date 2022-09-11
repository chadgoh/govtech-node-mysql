const database = require("../../database");
const Teacher = database.teachers;
const Student = database.students;
const Student_Teacher = database.student_teacher;
const { Op } = require("sequelize");
const NotificationResponse = require("../responsemodels/notification.response.js");

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
  console.log(result.map((element) => element["student.email"]));

  const response = new NotificationResponse.NotificationResponse(
    result.map((element) => element["student.email"])
  );

  res.status(200).send(response);
};
