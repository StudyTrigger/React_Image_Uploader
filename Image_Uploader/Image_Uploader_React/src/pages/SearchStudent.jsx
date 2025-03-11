import React, { useState } from "react";
import axios from "axios";

const SearchStudent = () => {
  const [enrollmentNo, setEnrollmentNo] = useState("");
  const [student, setStudent] = useState(null);
  const [error, setError] = useState("");

  const handleSearch = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/students/${enrollmentNo}`);
      setStudent(res.data);
      setError("");
    } catch (err) {
      setStudent(null);
      setError("Student not found!");
    }
  };

  return (
    <div>
      <h2>Search Student</h2>
      <input type="text" placeholder="Enter Enrollment No" value={enrollmentNo} onChange={(e) => setEnrollmentNo(e.target.value)} />
      <button onClick={handleSearch}>Search</button>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {student && (
        <div>
          <img src={`http://localhost:5000${student.photo}`} alt={student.name} width="100" height="100" />
          <p><strong>Name:</strong> {student.name}</p>
          <p><strong>Class:</strong> {student.class}</p>
          <p><strong>Course:</strong> {student.course}</p>
        </div>
      )}
    </div>
  );
};

export default SearchStudent;
