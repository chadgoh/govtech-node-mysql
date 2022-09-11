const { mockRequest, mockResponse } = require("../interceptor.js");
const adminController = require("../../../app/teacher/controllers/teacher.admin.controller.js");
const teacherService = require("../../../app/teacher/repositories/teacher.repository.js");
const studentService = require(".../../../app/student/repositories/student.repository.js");
jest.mock("../../../app/teacher/repositories/teacher.repository.js");
jest.mock(".../../../app/student/repositories/student.repository.js");

describe("Testing Method registerStudents", () => {
  test("should return 204 and return correct values", async () => {
    const requestStub = {
      headers: "application/json",
      body: {
        teacher: "toDelete@gmail.com",
        students: ["todelete_stu@gmail.com,123@gmail.com"],
      },
    };
    let req = requestStub;
    studentService.findOrCreateStudent = jest.fn(() => {
      return Promise.reject();
    });

    teacherService.findTeacherByEmail = jest.fn(() => {
      return Promise.resolve(false);
    });

    teacherService.registerStudentsToTeacher = jest.fn(() => {
      return Promise.resolve(false);
    });

    // console.log("mock res = ", mockResponse.status());
    const mockResponse = () => {
      const res = {};
      res.status = jest.fn().mockReturnValue(res);
      res.json = jest.fn().mockReturnValue(res);
      res.send = jest.fn().mockReturnValue(res);
      return res;
    };

    const res = mockResponse();

    adminController.registerStudent(req, res);
    expect(res.send).toHaveBeenCalledWith(0);

    // expect(res.status);
  });
});
