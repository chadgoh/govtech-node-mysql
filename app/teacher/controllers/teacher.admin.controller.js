const NotificationResponse = require("../responsemodels/notification.response.js");
const CommonStudentResponse = require("../responsemodels/commonstudents.response.js");
const teacherService = require("../repositories/teacher.repository.js");
const studentService = require("../../student/repositories/student.repository.js");

exports.registerStudent = (req, res) => {
  console.log(req.headers["content-type"]);
  if (
    req.body == null ||
    req.body.teacher == null ||
    req.body.students == null
  ) {
    res.status(400).send({ message: "Invalid Request, check request body;" });
  }

  const { teacher: teacherEmail, students: studentEmails } = req.body;

  studentEmails.forEach(async (email) => {
    studentService.findOrCreateStudent(email);
  });

  teacherService
    .findTeacherByEmail(teacherEmail)
    .then((foundTeacher) => {
      console.log(foundTeacher);
      if (foundTeacher) {
        teacherService.registerStudentsToTeacher(foundTeacher, studentEmails);
        res.status(204).send();
      } else {
        res.status(404).send({
          message: `Unable tp find a teacher with the given email: ${teacherEmail}`,
        });
      }
    })
    .catch((error) => {
      res.status(500).send({
        message:
          error.message || "Internal Server Error when registering students.",
      });
    });
};

exports.commonStudents = async (req, res) => {
  const teachers = req.query.teacher;

  try {
    const students = await teacherService.findAllCommonStudents(teachers);
    console.log(students);
    res
      .status(200)
      .send(
        CommonStudentResponse(students.map((student) => student.studentEmail))
      );
  } catch (error) {
    res.status(500).send({
      message:
        error.message || "Internal Server Error when finding common students.",
    });
  }
};

exports.suspendStudent = async (req, res) => {
  if (req.body == null || req.body.student == null) {
    res
      .status(400)
      .send({ message: "Invalid Request. Make sure you specify a student." });
  }

  const studentEmail = req.body.student;

  try {
    const result = await studentService.suspendStudent(studentEmail, true);
    console.log(result);
    if (result[0] == 1) {
      res.status(204).send();
    } else {
      res.status(400).send({
        message: `Cannot suspend student with email: ${studentEmail}.`,
      });
    }
  } catch (error) {
    res.status(500).send({
      message: `Internal Server Error when trying to suspend student: ${studentEmail}`,
    });
  }
};

exports.unsuspendStudent = async (req, res) => {
  if (req.body == null || req.body.student == null) {
    res
      .status(400)
      .send({ message: "Invalid Request. Make sure you specify a student." });
  }

  const studentEmail = req.body.student;

  try {
    const result = await studentService.suspendStudent(studentEmail, false);
    console.log(result);
    if (result[0] == 1) {
      res.status(204).send();
    } else {
      res.status(400).send({
        message: `Cannot unsuspend student with email: ${studentEmail}.`,
      });
    }
  } catch (error) {
    res.status(500).send({
      message:
        error.message ||
        `Internal Server Error when trying to unsuspend student: ${studentEmail}`,
    });
  }
};

exports.retrieveForNotifications = async (req, res) => {
  if (req.body == null) {
    res.send(400).send({ message: "Invalid Request." });
  }

  const teacherEmail = req.body.teacher;
  const splitStudents = req.body.notification.split("@");
  const notificationMessage = splitStudents.shift(); // not in use
  const taggedStudents = [];

  for (let index = 0; index < splitStudents.length; index += 2) {
    const element = splitStudents[index]
      .concat("@" + splitStudents[index + 1])
      .trim();
    taggedStudents.push(element);
  }
  console.log(taggedStudents);
  try {
    const result = await teacherService.findAllRecipients(
      teacherEmail,
      taggedStudents
    );
    const recipientsList = result.map((element) => element["student.email"]);
    recipientsList.length === 0
      ? res
          .status(404)
          .send({ message: "Could not find any students to notify." })
      : res.status(200).send(NotificationResponse(recipientsList));
  } catch (error) {
    res.status(500).send({
      message:
        error.message || `Internal Server Error when trying to get recipents`,
    });
  }
};
