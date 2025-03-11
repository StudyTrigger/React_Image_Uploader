import React, { useState, useEffect } from "react";
import { saveStudent } from "../services/students.service";
import "./StudentModal.css";

function StudentModal({ isOpen, onClose, onStudentAdded, student }) {

  const [formData, setFormData] = useState({
    enrollmentNo: "",
    name: "",
    class: "",
    course: "",
    photo: null,
  });

  useEffect(() => {
    if (student) {
      setFormData({
        enrollmentNo: student.enrollmentNo || "",
        name: student.name || "",
        class: student.class || "",
        course: student.course || "",
        photo: student.photo || null,
      });
    }
    else {
      setFormData({
        enrollmentNo:  "",
        name:"",
        class: "",
        course: "",
        photo: null,
      });
    }
  }, [student]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, photo: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    debugger;
    e.preventDefault();

    const result = await saveStudent(formData, !!student, student?.enrollmentNo);

    alert(result.message);
    if (result.success) {
      onStudentAdded();
      onClose();
    }
  };


  return (
    isOpen && (
      <div className="modal-overlay">
        <div className="modal-content">
          <h2>{student ? "Edit Student" : "Add Student"}</h2>
          <form onSubmit={handleSubmit}>
            <input type="text" name="enrollmentNo" placeholder="Enrollment No" value={formData.enrollmentNo} onChange={handleChange} required />
            <input type="text" name="name" placeholder="Name" value={formData.name} onChange={handleChange} required />
            <input type="text" name="class" placeholder="Class" value={formData.class} onChange={handleChange} required />
            <input type="text" name="course" placeholder="Course" value={formData.course} onChange={handleChange} required />
            <input type="file" name="photo" accept="image/*" onChange={handleFileChange} />
            <div className="button-group">
              <button type="submit" className="submit-btn">Submit</button>
              <button type="button" className="close-btn" onClick={onClose}>Close</button>
            </div>
          </form>
        </div>
      </div>
    )
  );
};


export default StudentModal;
