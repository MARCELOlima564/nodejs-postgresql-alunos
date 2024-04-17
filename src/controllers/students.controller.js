import { Student } from "../models/students/Student.js";
import StudentsRepository from "../models/students/StudentsRepository.js";

const studentsRepository = new StudentsRepository();

export const getStudents = async (req, res) => {
  try {
    const students = await studentsRepository.getStudents();
    if (!students || students.length === 0) {
      return res.status(404).send({ message: "Não há estudantes cadastrados" });
    }
    return res.status(200).send({ totalStudents: students.length, students });
  } catch (error) {
    return res
      .status(500)
      .send({ message: "Erro ao buscar estudante", error: error.message });
  }
};

export const getStudentById = async (req, res) => {
  try {
    const { id } = req.params;
    const student = await studentsRepository.getStudentById(id);
    if (!student) {
      return res.status(404).send({ message: "Estudante não encontrado" });
    }
    return res.status(200).send({ message: "Estudante encontrado", student });
  } catch (error) {
    return res
      .status(500)
      .send({ message: "Erro ao buscar Estudante", error: error.message });
  }
};

export const createStudent = async (req, res) => {
  try {
    const { name, age, email, code, grade } = req.body;
    const studentAlreadyExists = await studentsRepository.getStudentByEmail(email);
    if (studentAlreadyExists) {
      return res.status(409).send({ message: "Estudante já cadastrado" });
    }
    const studant = new Student(name, age, email, code, grade);
    await studentsRepository.addStudent(studant);
    return res
      .status(201)
      .send({ message: "Estudante criado com sucesso", user });
  } catch (error) {
    return res
      .status(500)
      .send({ message: "Erro ao criar Estudante", error: error.message });
  }
};

export const updateStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, age, email, code, grade } = req.body;
    const studentById = await studentsRepository.getStudentById(id);
    if (!studentById) {
      return res.status(404).send({ message: "Estudante não encontrado" });
    }
    const studentByEmail = await studentsRepository.getStudentByEmail(email);
    if (studentByEmail && studentByEmail.id !== id) {
      return res.status(409).send({ message: "Email já cadastrado" });
    }
    const updatedStudent = await studentsRepository.updateStudent(
      id,
      name,
      age,
      email,
      code,
      grade
    );
    return res
      .status(200)
      .send({ message: "Estudante atualizado com sucesso", updatedStudent });
  } catch (error) {
    return res
      .status(500)
      .send({ message: "Erro ao atualizar Estudante", error: error.message });
  }
};

export const deleteStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const student = await studentsRepository.getStudentById(id);
    if (!student) {
      return res.status(404).send({ message: "Estudante não encontrado" });
    }
    await studentsRepository.deleteStudent(id);
    return res.status(200).send({ message: "Estudante deletado com sucesso" });
  } catch (error) {
    return res
      .status(500)
      .send({ message: "Erro ao deletar Estudante", error: error.message });
  }
};
