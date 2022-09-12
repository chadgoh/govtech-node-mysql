const database = require("../../database");
const Teacher = database.teachers;
const Student = database.students;
const Student_Teacher = database.student_teacher;
const { Op } = require("sequelize");

module.exports.create = async (teacher) => {
  return await Teacher.create({ email: teacher });
};

module.exports.findTeacherByEmail = async (email) => {
  const result = await Teacher.findOne({
    where: { email: email },
  });
  console.log(result);
  return result;
};

module.exports.registerStudentsToTeacher = async (teacher, students) => {
  const foundTeacher = await this.findTeacherByEmail(teacher);

  if (foundTeacher != null) {
    students.map((student) =>
      Student.findOrCreate({ where: { email: student } })
    );
    return await foundTeacher.addStudents(students);
  }
  return null;
};

module.exports.findAllCommonStudents = async (teachers) => {
  let teacherCount = 0;
  console.log(typeof teachers == "string");
  if (typeof teachers === "string") {
    teacherCount = 1;
  } else {
    teacherCount = teachers.length;
  }
  const [results, metadata] = await database.sequelize.query(
    "SELECT `studentEmail`, COUNT('studentEmail') AS teacherCount" +
      " FROM `student_teachers` " +
      "WHERE `student_teachers`.`teacherEmail` IN(:teachers)" +
      "GROUP BY `studentEmail` HAVING teacherCount = :teacherCount;",
    {
      replacements: {
        teachers: typeof teachers !== "string" ? [...teachers] : teachers,
        teacherCount: teacherCount,
      },
    }
  );

  return results;
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
