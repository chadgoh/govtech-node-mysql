const database = require("../../database");
const Student = database.students;

module.exports.suspendStudent = async function (studentEmail, suspend) {
  const result = await Student.update(
    { isSuspended: suspend },
    { where: { email: studentEmail } }
  );
  return result;
};

module.exports.findOrCreateStudent = async (email) => {
  return await Student.findOrCreate({ where: { email: email }, raw: true });
};

module.exports.deleteStudentByEmail = async (email) => {
  return await Student.destroy({
    where: { email: email },
  });
};

module.exports.findAllStudents = async () => {
  return await Student.findAll();
};
