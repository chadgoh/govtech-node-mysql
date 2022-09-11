const dbConfig = require("../config/db.config.js");
const Sequelize = require("sequelize");
const applyExtraSetup = require("./extra-setup.js");

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  operatorAliases: false,
  pool: {
    max: dbConfig.max,
    min: dbConfig.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle,
  },
});

const database = {};

database.Sequelize = Sequelize;
database.sequelize = sequelize;

database.teachers = require("../teacher/teacher.model.js")(
  sequelize,
  Sequelize
);
database.students = require("../student/student.model.js")(
  sequelize,
  Sequelize
);
database.student_teacher = require("./extra-setup.js")(sequelize, Sequelize);

applyExtraSetup(sequelize, Sequelize);

module.exports = database;
