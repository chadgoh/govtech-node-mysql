const chai = require("chai");
const sinon = require("sinon");
const expect = chai.expect;
const teacherController = require("../../dcube/app/teacher/controllers/teacher.admin.controller.js");
const teacherRepository = require("../../dcube/app/teacher/repositories/teacher.repository.js");
const studentRepository = require("../../dcube/app/student/repositories/student.repository.js");

describe("TeacherAdminController", function () {
  /* 
 
    /api/registerStudents

*/
  describe("registerStudents", function () {
    let res, resStatus;
    beforeEach(() => {
      res = {
        status: (s) => {
          return {
            send: () => {},
          };
        },
      };

      resStatus = sinon.spy(res, "status");
    });
    const registerStudentsStub = sinon
      .stub(teacherRepository, "registerStudentsToTeacher")
      .returns("result");
    registerStudentsStub.onFirstCall().returns(null);
    registerStudentsStub.onSecondCall().throws();

    it("Teacher doesn't exist; => should respond with 400", async function () {
      const req = {
        headers: { "content-type": "application/json" },
        body: {
          teacher: "teacherben@gmail.com",
          students: ["studenthon@gmail.com", "studentjon@gmail.com"],
        },
      };

      await teacherController.registerStudent(req, res);

      expect(resStatus.args[0][0]).to.equal(400);
    });

    it("Error in try-catch ; => should respond with 500", async function () {
      const req = {
        headers: { "content-type": "application/json" },
        body: {
          teacher: "teacherben@gmail.com",
          students: ["studenthon@gmail.com", "studentjon@gmail.com"],
        },
      };

      await teacherController.registerStudent(req, res);

      expect(resStatus.args[0][0]).to.equal(500);
    });

    it("Happy path; => should respond with 204", async function () {
      const req = {
        headers: { "content-type": "application/json" },
        body: {
          teacher: "teacherben@gmail.com",
          students: ["studenthon@gmail.com", "studentjon@gmail.com"],
        },
      };

      await teacherController.registerStudent(req, res);

      expect(resStatus.args[0][0]).to.equal(204);
    });

    it("Body null; => should respond with 400", async function () {
      const req = {
        headers: { "content-type": "application/json" },
        body: {},
      };

      await teacherController.registerStudent(req, res);

      expect(resStatus.args[0][0]).to.equal(400);
    });

    it("body.teacher null; => should respond with 400", async function () {
      const req = {
        headers: { "content-type": "application/json" },
        body: { students: "xx" },
      };

      await teacherController.registerStudent(req, res);

      expect(resStatus.args[0][0]).to.equal(400);
    });

    it("body.students null; => should respond with 400", async function () {
      const req = {
        headers: { "content-type": "application/json" },
        body: { teacher: "xx" },
      };

      await teacherController.registerStudent(req, res);

      expect(resStatus.args[0][0]).to.equal(400);
    });
  }),
    /*
    /api/commonStudents
*/
    describe("commonStudents", function () {
      let res, resStatus;
      beforeEach(() => {
        res = {
          status: (s) => {
            return {
              send: () => {},
            };
          },
        };

        resStatus = sinon.spy(res, "status");
      });
      const registerStudentsStub = sinon
        .stub(teacherRepository, "findAllCommonStudents")
        .returns("");
      registerStudentsStub.onSecondCall().throws();

      it("No errors; => should respond with 200", async function () {
        const req = {
          headers: { "content-type": "application/json" },
          query: {
            teacher: "123",
          },
        };

        await teacherController.commonStudents(req, res);

        expect(resStatus.args[0][0]).to.equal(200);
      });

      it("Got errors; => should respond with 500", async function () {
        const req = {
          headers: { "content-type": "application/json" },
          query: {
            teacher: "123",
          },
        };

        await teacherController.commonStudents(req, res);

        expect(resStatus.args[0][0]).to.equal(500);
      });

      it("Empty Query; => should respond with 500", async function () {
        const req = {
          headers: { "content-type": "application/json" },
          query: {},
        };

        await teacherController.commonStudents(req, res);

        expect(resStatus.args[0][0]).to.equal(400);
      });
    });

  /*
        /api/suspendStudent
  */

  describe("suspendStudent", function () {
    let res, resStatus;
    beforeEach(() => {
      res = {
        status: (s) => {
          return {
            send: () => {},
          };
        },
      };

      resStatus = sinon.spy(res, "status");
    });
    const registerStudentsStub = sinon
      .stub(studentRepository, "suspendStudent")
      .returns([1]);

    registerStudentsStub.onSecondCall().returns([0]);
    registerStudentsStub.onThirdCall().throws();

    it("Happy path; => should respond with 204", async function () {
      const req = {
        headers: { "content-type": "application/json" },
        body: {
          student: "studentjon@gmail.com",
        },
      };

      await teacherController.suspendStudent(req, res);

      expect(resStatus.args[0][0]).to.equal(204);
    });

    it("No rows updated; => should respond with 400", async function () {
      const req = {
        headers: { "content-type": "application/json" },
        body: {
          student: "studentjon@gmail.com",
        },
      };

      await teacherController.suspendStudent(req, res);

      expect(resStatus.args[0][0]).to.equal(400);
    });

    it("Error caught; => should respond with 500", async function () {
      const req = {
        headers: { "content-type": "application/json" },
        body: {
          student: "studentjon@gmail.com",
        },
      };

      await teacherController.suspendStudent(req, res);

      expect(resStatus.args[0][0]).to.equal(500);
    });

    it("body null; => should respond with 400", async function () {
      const req = {
        headers: { "content-type": "application/json" },
        body: {},
      };

      await teacherController.suspendStudent(req, res);

      expect(resStatus.args[0][0]).to.equal(400);
    });

    it("body.student null; => should respond with 400", async function () {
      const req = {
        headers: { "content-type": "application/json" },
        body: { student: null },
      };

      await teacherController.suspendStudent(req, res);

      expect(resStatus.args[0][0]).to.equal(400);
    });
  });

  /*
  /api/retrieveForNotifications
  */

  describe("retrieveForNotifications", function () {
    let res, resStatus;
    beforeEach(() => {
      res = {
        status: (s) => {
          return {
            send: () => {},
          };
        },
      };

      resStatus = sinon.spy(res, "status");
    });
    const registerStudentsStub = sinon
      .stub(teacherRepository, "findAllRecipients")
      .returns([1, 2, 3]);

    registerStudentsStub.onFirstCall().returns([]);
    registerStudentsStub.onSecondCall().throws();

    it("no recipients found; => should respond with 400", async function () {
      const req = {
        headers: { "content-type": "application/json" },
        body: {
          teacher: "teacherken@gmail.com",
          notification: "Hello students! @commonstudenthon@gmail.com",
        },
      };

      await teacherController.retrieveForNotifications(req, res);

      expect(resStatus.args[0][0]).to.equal(404);
    });

    it("error occurs in try-catch; => should respond with 500", async function () {
      const req = {
        headers: { "content-type": "application/json" },
        body: {
          teacher: "teacherken@gmail.com",
          notification: "Hello students! @commonstudenthon@gmail.com",
        },
      };

      await teacherController.retrieveForNotifications(req, res);

      expect(resStatus.args[0][0]).to.equal(500);
    });

    it("body null; => should respond with 400", async function () {
      const req = {
        headers: { "content-type": "application/json" },
        body: null,
      };

      await teacherController.retrieveForNotifications(req, res);

      expect(resStatus.args[0][0]).to.equal(400);
    });

    it("body.teacher null; => should respond with 400", async function () {
      const req = {
        headers: { "content-type": "application/json" },
        body: {
          notification: "123",
        },
      };

      await teacherController.retrieveForNotifications(req, res);

      expect(resStatus.args[0][0]).to.equal(400);
    });

    it("body.notification null; => should respond with 400", async function () {
      const req = {
        headers: { "content-type": "application/json" },
        body: {
          teacher: "123",
        },
      };

      await teacherController.retrieveForNotifications(req, res);

      expect(resStatus.args[0][0]).to.equal(400);
    });

    it("Happy Path; => should respond with 400", async function () {
      const req = {
        headers: { "content-type": "application/json" },
        body: {
          teacher: "teacherken@gmail.com",
          notification: "Hello students! @commonstudenthon@gmail.com",
        },
      };

      await teacherController.retrieveForNotifications(req, res);

      expect(resStatus.args[0][0]).to.equal(200);
    });
  });
});
