const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

require("dotenv").config();

const Developer = require("./models/Developer");
const Recruiter = require("./models/Recruiter");
const jobsRouter = require("./routes/jobs");

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/jobs", jobsRouter);

mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDB Cloud Connected Successfully");
    })
    .catch((error) => {
        console.log("MongoDB Connection Failed", error);
    });

app.get("/", (req, res) => {
    res.send("Backend server is running");
});

// Developer Register
app.post("/api/developerSignup", async (req, res) => {
    try {
        const { fullName, email, password, phone, collegeOrCompany, role, skills, experience, linkedin, github } = req.body;

        const existing = await Developer.findOne({ email });
        if (existing) return res.status(400).json({ message: "Email already registered" });

        const hashed = await bcrypt.hash(password, 10);

        const dev = new Developer({
            fullName,
            email,
            password: hashed,
            phone,
            collegeOrCompany,
            role,
            skills,
            experience,
            linkedin: linkedin || "",
            github: github || "",
        });

        await dev.save();

        res.status(201).json({ message: "Developer registered successfully" });
    } catch (err) {
        res.status(500).json({ message: "Registration failed", error: err.message });
    }
});

// Recruiter Register
// Recruiter Register (FIXED)
app.post("/api/recruiterSignup", async (req, res) => {
    try {
        // 1. Destructure the exact fields sent by the React frontend
        const { 
            companyName, 
            recruiterName, 
            email, 
            password, 
            website, 
            industry, 
            companySize, 
            techStack 
        } = req.body;

        // 2. Check for existing email
        const existing = await Recruiter.findOne({ email });
        if (existing) return res.status(400).json({ message: "Email already registered" });

        // 3. Hash the password
        const hashed = await bcrypt.hash(password, 10);

        // 4. Create the new recruiter mapping correctly to your Mongoose Schema
        const rec = new Recruiter({
            companyName,
            recruiterName,
            email,
            password: hashed,
            website,
            industry,
            companySize,
            techStack,
        });

        // 5. Save to MongoDB
        await rec.save();

        res.status(201).json({ message: "Recruiter registered successfully" });
    } catch (err) {
        res.status(500).json({ message: "Registration failed", error: err.message });
    }
});

// Sign In (both developers and recruiters)
app.post("/api/signin", async (req, res) => {
    try {
        const { email, password, userType } = req.body;

        // Make sure userType is provided
        if (!userType) {
            return res.status(400).json({ message: "Please select whether you are a Developer or Recruiter" });
        }

        // Search in the correct model based on userType
        let user;
        if (userType === "developer") {
            user = await Developer.findOne({ email });
        } else if (userType === "recruiter") {
            user = await Recruiter.findOne({ email });
        } else {
            return res.status(400).json({ message: "Invalid user type" });
        }

        if (!user) {
            return res.status(400).json({ message: "No account found with this email" });
        }

        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.status(400).json({ message: "Invalid password" });
        }

        const token = jwt.sign(
            { id: user._id, email: user.email, userType },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        // Send the response back to frontend
        res.status(200).json({
            message: "Login successful",
            token,
            user: {
                id: user._id,
                // FIXED: If recruiter, use recruiterName. If developer, use fullName.
                fullName: userType === "recruiter" ? user.recruiterName : user.fullName,
                email: user.email,
                userType,
            },
        });
    } catch (err) {
        res.status(500).json({ message: "Signin failed", error: err.message });
    }
});

app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
});
