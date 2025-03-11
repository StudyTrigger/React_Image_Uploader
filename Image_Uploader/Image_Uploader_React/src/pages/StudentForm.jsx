import React, { useState } from "react";
import axios from "axios";

const StudentForm = () => {
  const [student, setStudent] = useState({
    enrollmentNo: "",
    name: "",
    class: "",
    course: "",
    photo: null,
  });

  const handleChange = (e) => {
    setStudent({ ...student, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setStudent({ ...student, photo: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("enrollmentNo", student.enrollmentNo);
    formData.append("name", student.name);
    formData.append("class", student.class);
    formData.append("course", student.course);
    formData.append("photo", student.photo);

    try {
      await axios.post("http://localhost:5000/students", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Student added successfully!");
      setStudent({ enrollmentNo: "", name: "", class: "", course: "", photo: null });
    } catch (error) {
      console.error("Error adding student:", error);
      alert("Failed to add student.");
    }
  };

  return (
    <div>
      <h2>Add Student</h2>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <input type="text" name="enrollmentNo" placeholder="Enrollment No" value={student.enrollmentNo} onChange={handleChange} required />
        <input type="text" name="name" placeholder="Name" value={student.name} onChange={handleChange} required />
        <input type="text" name="class" placeholder="Class" value={student.class} onChange={handleChange} required />
        <input type="text" name="course" placeholder="Course" value={student.course} onChange={handleChange} required />
        <input type="file" name="photo" accept="image/*" onChange={handleFileChange} required />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default StudentForm;
