const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const Job = require("./models/Job");
const Recruiter = require("./models/Recruiter");

const SampleJobsData = [
  {
    title: "Senior Software Engineer",
    company: "ABC Pvt Ltd",
    experience: 5,
    workLocationType: "Hybrid",
    workLocation: "Hyderabad",
    jobDescription: "Develop and maintain scalable web applications using modern technologies. Lead technical discussions and mentor junior developers. Collaborate with product managers and backend team to deliver features.",
    industryType: "IT",
    employmentType: "Full-time",
    education: "B.Tech / M.Tech",
    salary: { min: 1200000, max: 1800000, currency: "INR" },
    requiredSkills: ["JavaScript", "React", "Node.js", "MongoDB", "AWS"],
    companyLogo: "https://images.unsplash.com/photo-1549923746-c502d488b3ea?auto=format&fit=crop&w=150&h=150&q=80",
    isActive: true
  },
  {
    title: "Frontend Developer",
    company: "XYZ Pvt Ltd",
    experience: 2,
    workLocationType: "Remote",
    workLocation: "Anywhere",
    jobDescription: "Build responsive and interactive user interfaces using React. Work with modern CSS frameworks and ensure cross-browser compatibility. Implement high-quality visual designs.",
    industryType: "IT",
    employmentType: "Full-time",
    education: "B.Tech",
    salary: { min: 600000, max: 1000000, currency: "INR" },
    requiredSkills: ["HTML", "CSS", "JavaScript", "React", "Responsive Design"],
    companyLogo: "https://images.unsplash.com/photo-1560179707-f14e90ef3623?auto=format&fit=crop&w=150&h=150&q=80",
    isActive: true
  },
  {
    title: "Backend Developer",
    company: "Tech Solutions",
    experience: 3,
    workLocationType: "Onsite",
    workLocation: "Bangalore",
    jobDescription: "Develop robust REST APIs and manage databases. Design scalable system architecture and optimize database queries. Integrate third-party web services.",
    industryType: "IT",
    employmentType: "Full-time",
    education: "B.Tech",
    salary: { min: 800000, max: 1400000, currency: "INR" },
    requiredSkills: ["Node.js", "Express", "MongoDB", "PostgreSQL", "REST APIs"],
    companyLogo: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=150&h=150&q=80",
    isActive: true
  },
  {
    title: "Java Developer",
    company: "Infosys",
    experience: 4,
    workLocationType: "Hybrid",
    workLocation: "Pune",
    jobDescription: "Develop Java-based enterprise applications. Work with Spring Boot framework and microservices architecture. Write unit tests and maintain high code quality.",
    industryType: "IT",
    employmentType: "Full-time",
    education: "B.Tech",
    salary: { min: 900000, max: 1500000, currency: "INR" },
    requiredSkills: ["Java", "Spring Boot", "Microservices", "REST APIs", "MySQL"],
    companyLogo: "https://images.unsplash.com/photo-1572021335469-31706a17aaef?auto=format&fit=crop&w=150&h=150&q=80",
    isActive: true
  },
  {
    title: "Full Stack Developer",
    company: "Digital Innovations",
    experience: 3,
    workLocationType: "Remote",
    workLocation: "Anywhere",
    jobDescription: "Develop full-stack web applications. Handle both frontend and backend responsibilities with a strong focus on user experience. Optimize application performance.",
    industryType: "IT",
    employmentType: "Full-time",
    education: "B.Tech",
    salary: { min: 1000000, max: 1600000, currency: "INR" },
    requiredSkills: ["React", "Node.js", "MongoDB", "Express", "JavaScript"],
    companyLogo: "https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=150&h=150&q=80",
    isActive: true
  },
  {
    title: "DevOps Engineer",
    company: "Cloud Systems",
    experience: 5,
    workLocationType: "Hybrid",
    workLocation: "Delhi",
    jobDescription: "Manage cloud infrastructure and CI/CD pipelines. Ensure system reliability, deploy software patches, and implement system automation solutions.",
    industryType: "IT",
    employmentType: "Full-time",
    education: "B.Tech",
    salary: { min: 1100000, max: 1700000, currency: "INR" },
    requiredSkills: ["Docker", "Kubernetes", "AWS", "Jenkins", "Linux"],
    companyLogo: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=150&h=150&q=80",
    isActive: true
  }
];

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("Connected to MongoDB for seeding...");

    // 1. Create a default Recruiter if not exists
    const seedEmail = "recruiter@example.com";
    let recruiter = await Recruiter.findOne({ email: seedEmail });
    
    if (!recruiter) {
      console.log("Creating default recruiter account...");
      const hashedPassword = await bcrypt.hash("password123", 10);
      recruiter = new Recruiter({
        fullName: "Default Seed Recruiter",
        email: seedEmail,
        password: hashedPassword,
        phone: "9876543210",
        company: "Seed Recruiting Corp",
        designation: "Talent Acquisition Manager"
      });
      await recruiter.save();
      console.log("Recruiter account created successfully.");
    }

    // 2. Clear old jobs posted by this seed script
    console.log("Cleaning old jobs...");
    await Job.deleteMany({ postedBy: recruiter._id });

    // 3. Inject new seed jobs
    console.log("Inserting sample jobs...");
    const jobsWithRecruiter = SampleJobsData.map(job => ({
      ...job,
      postedBy: recruiter._id
    }));

    await Job.insertMany(jobsWithRecruiter);
    console.log("Jobs seeded successfully!");
    
    console.log("\n==============================================");
    console.log("Test Recruiter Credentials:");
    console.log(`Email:    ${seedEmail}`);
    console.log("Password: password123");
    console.log("==============================================\n");

    process.exit(0);
  })
  .catch((err) => {
    console.error("Connection/Seeding failed:", err);
    process.exit(1);
  });
