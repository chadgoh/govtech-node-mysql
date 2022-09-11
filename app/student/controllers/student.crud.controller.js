const database = require("../../database");
const Student = database.students;
const studentService = require("../repositories/student.repository.js");

exports.createStudent = async (req, res) => {
  const email = req.body.email;

  try {
    await studentService.findOrCreateStudent(email);
    res.status(204).send();
  } catch (error) {
    res.status(500).send({
      message:
        error.message || "Internal Server Error occured when creating teacher.",
    });
  }
};

exports.deleteStudentByEmail = async (req, res) => {
  const email = req.body.email;

  try {
    const data = await studentService.deleteStudentByEmail(email);
    if (data == 1) {
      res.status(200).send({
        message: "Student successfully deleted.",
      });
    } else {
      res.status(400).send({
        message: `Cannot delete Student with email=${email}`,
      });
    }
  } catch (error) {
    res.status(500).send({
      message: error.message || `Cannot delete Student with email=${email}`,
    });
  }
};

exports.findAllStudents = async (req, res) => {
  try {
    const result = await studentService.findAllStudents();
    if (result.length > 1) {
      res.status(200).send(result.map((student) => student["email"]));
    } else {
      res.status(200).send(result);
    }
  } catch (error) {
    res.status(500).send({
      message: error.message || `Internal Server Error finding all students.`,
    });
  }
};
