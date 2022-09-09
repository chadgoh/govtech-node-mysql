module.exports = (sequelize, Sequelize) => {
  const Student = sequelize.define(
    "student",
    {
      // id: {
      //   type: Sequelize.INTEGER,
      //   primaryKey: true,
      //   autoIncrement: true,
      // },
      email: {
        primaryKey: true,
        type: Sequelize.STRING,
      },
      isSuspended: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      timestamps: false,
    }
  );

  return Student;
};
