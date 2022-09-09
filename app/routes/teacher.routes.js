module.exports = (app) => {
  const teacher = require("../controllers/teacher.controller.js");
  var router = require("express").Router();

  router.post("/teachers/create", teacher.createTeacher);
  router.get("/teachers/", teacher.findAll);
  router.post("/teachers/findTeacherById", teacher.findTeacherById);
  router.put("/teachers/updateTeacher", teacher.updateTeacher);

  router.post("/register", teacher.registerStudent); // return 204 on success
  router.get("/commonstudents", teacher.commonStudents); // 200 on success
  router.post("/suspend", teacher.suspendStudent); // 204 on success
  router.post("/unsuspend", teacher.unsuspendStudent); // 204 on success
  router.post("/retrievefornotifications"); //200 on success

  app.use("/api", router);
};
