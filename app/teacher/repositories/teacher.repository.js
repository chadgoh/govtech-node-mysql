const database = require("../../database");
const Teacher = database.teachers;
const Student = database.students;
const Student_Teacher = database.student_teacher;
const { Op } = require("sequelize");

module.exports.findTeacherByEmail = async (email) => {
  const result = await Teacher.findOne({
    where: { email: email },
  });
  console.log(result);
  return result;
};

module.exports.registerStudentsToTeacher = async (teacher, students) => {
  return await teacher.addStudents(students);
};

module.exports.findAllCommonStudents = async (teachers) => {
  return await Student_Teacher.findAll({
    attributes: ["studentEmail"],
    where: {
      teacherEmail: {
        [Op.or]: teachers,
      },
    },
    raw: true,
    group: "studentEmail",
  });
};

module.exports.findAllRecipients = async (teacherEmail, taggedStudents) => {
  return await Student_Teacher.findAll({
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
};
