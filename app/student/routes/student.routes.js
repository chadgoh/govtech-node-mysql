module.exports = (app) => {
  const studentCrud = require("../controllers/student.crud.controller.js");
  var router = require("express").Router();

  router.post("/create", studentCrud.createStudent);
  router.post("/delete", studentCrud.deleteStudentByEmail);
  router.get("/findAll", studentCrud.findAllStudents);

  app.use("/api/students", router);
};
