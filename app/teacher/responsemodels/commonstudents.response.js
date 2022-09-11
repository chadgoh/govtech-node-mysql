class CommonStudentsResponse {
  constructor(students) {
    this.students = students;
  }

  get() {
    return this.students;
  }
}

module.exports = function (students) {
  return new CommonStudentsResponse(students);
};
