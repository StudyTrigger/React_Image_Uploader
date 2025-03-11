import React, { useEffect, useState } from "react";
import StudentModal from "./StudentModal";
import "./StudentList.css";
import { getStudents, deleteStudent } from "../services/students.service";

const StudentList = ({ onEdit }) => {
    const [students, setStudents] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [isModalOpen, setModalOpen] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState(null);

    useEffect(() => {
        getAllStudents();
    }, []);

    const getAllStudents = async () => {
        try {
            const data = await getStudents();
            setStudents(data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleDelete = async (enrollmentNo) => {
        try {
            const deletedId = await deleteStudent(enrollmentNo);
            if (deletedId) {
                setStudents(students.filter(student => student.enrollmentNo !== deletedId));
            }
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="container">
            <h2>Student List</h2>

            <div className="table-actions">
                <button className="add-btn" onClick={() => setModalOpen(true)}>Add</button>
                <input
                    type="text"
                    placeholder="Search by name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <table className="student-table">
                <thead>
                    <tr>
                        <th>Enrollment No</th>
                        <th>Name</th>
                        <th>Class</th>
                        <th>Course</th>
                        <th>Photo</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {students.filter(student =>
                        student.name.toLowerCase().includes(searchTerm.toLowerCase())
                    ).map((student) => (
                        <tr key={student.enrollmentNo}>
                            <td>{student.enrollmentNo}</td>
                            <td>{student.name}</td>
                            <td>{student.class}</td>
                            <td>{student.course}</td>
                            <td>
                                <img src={`http://localhost:5000${student.photo}`} alt={student.name} className="student-photo" />
                            </td>
                            <td>
                                <button className="edit-btn" onClick={() => {
                                    setSelectedStudent(student);
                                    setModalOpen(true);
                                }}>Edit</button>
                                <button className="delete-btn" onClick={() => handleDelete(student.enrollmentNo)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <StudentModal
                isOpen={isModalOpen}
                onClose={() => { setModalOpen(false); setSelectedStudent(null); }}
                onStudentAdded={getAllStudents}
                student={selectedStudent}
            />
        </div>
    );
};

export default StudentList;
