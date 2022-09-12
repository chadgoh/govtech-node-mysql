const chai = require("chai");
const sinon = require("sinon");
const expect = chai.expect;
const teacherRepository = require("../../dcube/app/teacher/repositories/teacher.repository.js");
const database = require("../../dcube/app/database/index.js");

describe("TeacherRepository", function () {
  const stubValue = {
    email: "fakeTeacher@gmail.com",
  };
  describe("create", function () {
    it("should add a new teacher to the db", async function () {
      const stub = sinon.stub(database.teachers, "create").returns(stubValue);
      const user = await teacherRepository.create(stubValue.email);

      expect(stub.calledOnce).to.be.true;
      expect(user.email).to.equal(stubValue.email);
    });
  });
});

// describe("teacherRepository create without email", function () {
//   const stubValue = {
//     email: "fakeTeacher@gmail.com",
//   };
//   describe("create", function () {
//     it("should add a new teacher to the db", async function () {
//       console.log(stubValue);
//       const stub = sinon.stub(database.teachers, "create").returns(stubValue);
//       const user = await teacherRepository.create(stubValue.email);
//       console.log(user);
//       expect(stub.calledOnce).to.be.true;
//       expect(user.email).to.equal(stubValue.email);
//     });
//   });
// });
