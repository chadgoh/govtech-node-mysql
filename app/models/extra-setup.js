module.exports = (sequelize, Sequelize) => {
  const { teacher, student } = sequelize.models;
  console.log(sequelize.models);
  const Student_Teacher = sequelize.define(
    "student_teacher",
    {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      teacherEmail: {
        type: Sequelize.STRING,
        references: {
          model: teacher,
          key: teacher.id,
        },
      },
      studentEmail: {
        type: Sequelize.STRING,
        references: {
          model: student,
          key: student.id,
        },
      },
    },
    { timestamps: false }
  );

  teacher.belongsToMany(student, {
    through: "student_teacher",
  });
  student.belongsToMany(teacher, {
    through: "student_teacher",
  });

  Student_Teacher.belongsTo(student);
  Student_Teacher.belongsTo(teacher);

  student.hasMany(Student_Teacher);
  teacher.hasMany(Student_Teacher);

  return Student_Teacher;
};
