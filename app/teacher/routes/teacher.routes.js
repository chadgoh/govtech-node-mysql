module.exports = (app) => {
  const teacherCrud = require("../controllers/teacher.crud.controller.js");
  const teacherAdmin = require("../controllers/teacher.admin.controller");
  var router = require("express").Router();

  router.post("/teachers/create", teacherCrud.createTeacher);
  router.get("/teachers/", teacherCrud.findAll);
  router.post("/teachers/findTeacherByEmail", teacherCrud.findTeacherByEmail);
  router.post("/teacher/delete", teacherCrud.delete);

  router.post("/register", teacherAdmin.registerStudent); // return 204 on success
  router.get("/commonstudents", teacherAdmin.commonStudents); // 200 on success
  router.post("/suspend", teacherAdmin.suspendStudent); // 204 on success
  router.post("/unsuspend", teacherAdmin.unsuspendStudent); // 204 on success
  router.post(
    "/retrievefornotifications",
    teacherAdmin.retrieveForNotifications
  ); //200 on success

  app.use("/api", router);
};
