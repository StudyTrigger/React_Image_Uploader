const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads')); // Serve images as static files
const PORT = 5000;

mongoose.connect('mongodb://127.0.0.1:27017/studentDB')
    .then(() => console.log('rating system connected'))
    .catch((err) => console.log(err));

const StudentSchema = new mongoose.Schema({
    enrollmentNo: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    class: { type: String, required: true },
    course: { type: String, required: true },
    photo: { type: String, required: true } // Store image path
});

const Student = mongoose.model('Student', StudentSchema);


// Multer storage configuration
const storage = multer.diskStorage({
    destination: './uploads/',
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage });

// API to add a student
app.post('/students', upload.single('photo'), async (req, res) => {
    try {
        const { enrollmentNo, name, class: studentClass, course } = req.body;
        const photo = req.file ? `/uploads/${req.file.filename}` : "";

        const student = new Student({ enrollmentNo, name, class: studentClass, course, photo });
        await student.save();
        res.json({ message: "Student added successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// API to get all students
app.get('/students', async (req, res) => {
    try {
        const students = await Student.find();
        res.json(students);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// API to get student by enrollment number
app.get('/students/:enrollmentNo', async (req, res) => {
    try {
        const student = await Student.findOne({ enrollmentNo: req.params.enrollmentNo });
        if (!student) return res.status(404).json({ message: "Student not found" });

        res.json(student);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.put('/students/:enrollmentNo', upload.single('photo'), async (req, res) => {
    try {
        const { name, class: studentClass, course } = req.body;
        const enrollmentNo = req.params.enrollmentNo;

        // Find the student
        const student = await Student.findOne({ enrollmentNo });
        if (!student) {
            return res.status(404).json({ message: "Student not found" });
        }

        // Update fields
        student.name = name || student.name;
        student.class = studentClass || student.class;
        student.course = course || student.course;

        // If new photo is uploaded, update it
        if (req.file) {
            student.photo = `/uploads/${req.file.filename}`;
        }

        await student.save();
        res.json({ message: "Student updated successfully" });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.delete('/students/:enrollmentNo', async (req, res) => {
    try {
        const { enrollmentNo } = req.params;
        const student = await Student.findOne({ enrollmentNo });

        if (!student) {
            return res.status(404).json({ message: "Student not found" });
        }

        // Delete the image file from the uploads folder
        if (student.photo) {
            const photoPath = path.join(__dirname, student.photo);
            if (fs.existsSync(photoPath)) {
                fs.unlinkSync(photoPath); // Remove file
            }
        }

        // Delete student record from DB
        await Student.findOneAndDelete({ enrollmentNo });

        res.json({ message: "Student deleted successfully" });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
