module.exports = (sequelize, Sequelize) => {
  const Teacher = sequelize.define(
    "teacher",
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
    },
    {
      timestamps: false,
      returning: true,
    }
  );

  return Teacher;
};
