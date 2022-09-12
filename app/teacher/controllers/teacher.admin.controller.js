const NotificationResponse = require("../responsemodels/notification.response.js");
const CommonStudentResponse = require("../responsemodels/commonstudents.response.js");
const teacherRepository = require("../repositories/teacher.repository.js");
const studentRepository = require("../../student/repositories/student.repository.js");

exports.registerStudent = async (req, res) => {
  if (
    req.body == null ||
    req.body.teacher == null ||
    req.body.students == null
  ) {
    res.status(400).send({ message: "Invalid Request, check request body;" });
  }

  const { teacher: teacherEmail, students: studentEmails } = req.body;
  try {
    const result = await teacherRepository.registerStudentsToTeacher(
      teacherEmail,
      studentEmails
    );

    if (result == null) {
      res
        .status(400)
        .send({ message: "Invalid Request. Make sure teacher exists." });
    } else {
      res.status(204).send();
    }
  } catch (error) {
    res.status(500).send({
      message:
        error.message ||
        "Internal server error occured when trying to register students.",
    });
  }
};

exports.commonStudents = async (req, res) => {
  const teachers = req.query.teacher;

  if (teachers == null || teachers == undefined) {
    res.status(400).send({ message: "No input detected." });
  }

  try {
    const students = await teacherRepository.findAllCommonStudents(teachers);

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
    const result = await studentRepository.suspendStudent(studentEmail, true);

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
    const result = await studentRepository.suspendStudent(studentEmail, false);
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
  let teacherEmail, splitStudents, notificationMessage;
  if (
    req.body == null ||
    req.body.teacher == null ||
    req.body.notification == null
  ) {
    res.status(400).send({ message: "Invalid Request." });
  } else {
    teacherEmail = req.body.teacher;
    splitStudents = req.body.notification.split("@");
    notificationMessage = splitStudents.shift();

    const taggedStudents = [];
    try {
      for (let index = 0; index < splitStudents.length; index += 2) {
        const element = splitStudents[index]
          .concat("@" + splitStudents[index + 1])
          .trim();
        taggedStudents.push(element);
      }

      const result = await teacherRepository.findAllRecipients(
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
  }
};
