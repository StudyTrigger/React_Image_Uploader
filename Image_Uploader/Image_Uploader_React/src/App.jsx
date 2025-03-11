import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import StudentForm from "./pages/StudentForm";
import StudentList from "./pages/StudentList";
import SearchStudent from "./pages/SearchStudent";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<StudentForm />} />
        <Route path="/students" element={<StudentList />} />
        <Route path="/search" element={<SearchStudent />} />
      </Routes>
    </Router>
  );
}

export default App;
