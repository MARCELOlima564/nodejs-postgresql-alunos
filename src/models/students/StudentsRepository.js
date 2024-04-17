import db from "../../database/index.js"

export default class StudentsRepository {
  constructor() {
    this.db = db;
  }
 async getStudents() {
  try {
    const allStudents = await this.db.manyOrNone("SELECT * FROM students");
    // console.log(allUsers);
    return allStudents;
  } catch (error) {
    console.error("Failed to get students:", error);
    throw error; // rethrow to let the caller handle it
  }
  }

 async getStudentById(id) {
  try {
    const student = await this.db.oneOrNone(
      "SELECT * FROM students WHERE id = $1",
      id
    );
    return student;
  } catch (error) {
    console.error(`Failed to get student by id ${id}:`, error);
    throw error; // rethrow to let the caller handle it
  }
  }

  async getStudentByEmail(email) {
    try {
      const student = await this.db.oneOrNone(
        "SELECT * FROM students WHERE email = $1",
        email
      );
      return student ;
    } catch (error) {
      console.error(`Failed to get student  by email ${email}:`, error);
      throw error; // rethrow to let the caller handle it
    }
  }


 async addStudent(student) {
  try {
    await this.db.none(
      "INSERT INTO students (id, name, email, password) VALUES ($1, $2, $3, $4, $5, $6)",
      [student.id, student.name, student.age, student.email, student.code, student.grade]
    );
    return student;
  } catch (error) {
    console.error("Failed to create student:", error);
    throw error; // rethrow to let the caller handle it
  }
  }

 async updateStudent(id, name, age, email, code, grade) {
  try {
    const student = await this.getStudentById(id);

    if (!student) {
      return null;
    }

    const updateStudent = await this.db.one(
      "UPDATE students SET name = $1, age = $2, email = $3 code = $4 grade = $5 WHERE id = $6 RETURNING *",
      [name, age, email, code, grade, id]
    );

    return updateStudent;
  } catch (error) {
    console.error(`Failed to update student ${id}:`, error);
    throw error; // rethrow to let the caller handle it
  }
  }

 async deleteStudent(id) {
    try {
      await this.db.none("DELETE FROM students WHERE id = $1", id);
    } catch (error) {
      console.error(`Failed to delete student ${id}:`, error);
      throw error; // rethrow to let the caller handle it
    }
  }
}
