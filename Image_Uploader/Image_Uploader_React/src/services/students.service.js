import axios from "axios";

const API_URL = "http://localhost:5000/students";

// Fetch all students
export const getStudents = async () => {
    try {
        const res = await axios.get(API_URL);
        return res.data;
    } catch (err) {
        console.error("Error fetching students:", err);
        throw err;
    }
};

// Delete student by enrollmentNo
export const deleteStudent = async (enrollmentNo) => {
    try {
        const confirmDelete = window.confirm("Are you sure you want to delete this student?");
        if (!confirmDelete) return;

        await axios.delete(`${API_URL}/${enrollmentNo}`);
        return enrollmentNo; // Return enrollmentNo to update state
    } catch (error) {
        console.error("Error deleting student:", error);
        throw error;
    }
};

// Add or update student
export const saveStudent = async (studentData, isUpdating, enrollmentNo) => {
    debugger;
    try {
        const formData = new FormData();
        formData.append("enrollmentNo", studentData.enrollmentNo);
        formData.append("name", studentData.name);
        formData.append("class", studentData.class);
        formData.append("course", studentData.course);
        
        if (studentData.photo && studentData.photo instanceof File) {
            formData.append("photo", studentData.photo);
        }

        const url = isUpdating ? `${API_URL}/${enrollmentNo}` : API_URL;
        const method = isUpdating ? "PUT" : "POST";

        await axios({
            method,
            url,
            data: formData,
            headers: { "Content-Type": "multipart/form-data" },
        });

        return { success: true, message: `Student ${isUpdating ? "updated" : "added"} successfully!` };
    } catch (error) {
        console.error("Error:", error);
        return { success: false, message: `Failed to ${isUpdating ? "update" : "add"} student.` };
    }
};
