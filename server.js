const express = require("express");
const cors = require("cors");
const multer = require("multer");
const Joi = require("joi");
const fs = require("fs");

const app = express();

/* -------------------- CORS (IMPORTANT) -------------------- */
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://cse-jordanc.github.io"
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  })
);

/* -------------------- Middleware -------------------- */
app.use(express.json());
app.use(express.static("public"));

/* Ensure images folder exists */
fs.mkdirSync("./public/images", { recursive: true });

/* -------------------- Multer Setup -------------------- */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/images/");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

/* -------------------- Data -------------------- */
let skills = [
    { _id: 1, title: "Guitar Basics", img_name: "guitarbasics.png", category: "Music", level: "Beginner", lessons: 6, instructor: "Alex M.", description: "Open chords, strumming patterns, and 3 easy songs." }, 
    { _id: 2, title: "Intro to Web Design", img_name: "introtoweb.png", category: "Tech", level: "Intermediate", lessons: 8, instructor: "Priya S.", description: "HTML/CSS fundamentals and simple responsive layout." }, 
    { _id: 3, title: "Personal Fitness", img_name: "personalfitness.png", category: "Health", level: "Advanced", lessons: 10, instructor: "Rafael K.", description: "Strength, mobility, and tailored home workouts." }, 
    { _id: 4, title: "Digital Photography", img_name: "digitalphotography.png", category: "Creative", level: "Beginner", lessons: 5, instructor: "Jamie L.", description: "Basic camera settings, composition, and editing tips." }, 
    { _id: 5, title: "Spanish Basics", img_name: "spanishbasics.png", category: "Language", level: "Beginner", lessons: 6, instructor: "María R.", description: "Everyday phrases, pronunciation, and short dialogues." }, 
    { _id: 6, title: "Intro to Painting", img_name: "introtopainting.png", category: "Art", level: "Beginner", lessons: 4, instructor: "C. Nguyen", description: "Watercolor basics and easy still-life exercises." }, 
    { _id: 7, title: "Songwriting Essentials", img_name: "songwriting_essentials.png", category: "Music", level: "Intermediate", lessons: 4, instructor: "Alex M.", description: "Structure, melody, and lyric writing exercises for original songs." }, 
    { _id: 8, title: "Portrait Lighting Basics", img_name: "portrait_lighting.png", category: "Creative", level: "Beginner", lessons: 3, instructor: "Jamie L.", description: "Simple lighting setups for flattering portraits using natural and artificial light." }, 
    { _id: 9, title: "Intro to Adobe Illustrator", img_name: "intro_to_illustrator.png", category: "Tech", level: "Beginner", lessons: 6, instructor: "Priya S.", description: "Vector basics: shapes, pen tool, type, and exporting assets for web." }
];

/* -------------------- Routes -------------------- */

app.get("/api/skills", (req, res) => {
  res.send(skills);
});

app.get("/api/skills/:id", (req, res) => {
  const skill = skills.find((s) => s._id === parseInt(req.params.id));
  if (!skill) {
    res.status(404).send({ error: "Skill not found" });
    return;
  }
  res.send(skill);
});

/* -------------------- POST (Add Skill) -------------------- */
app.post("/api/skills", upload.single("img"), (req, res) => {
  try {
    const result = validateSkill(req.body);

    if (result.error) {
      res.status(400).send({ error: result.error.details[0].message });
      return;
    }

    if (!req.file) {
      res.status(400).send({ error: "Image is required." });
      return;
    }

    const skill = {
      _id: skills.length + 1,
      title: req.body.title,
      img_name: req.file.filename,
      category: req.body.category,
      level: req.body.level,
      lessons: Number(req.body.lessons),
      instructor: req.body.instructor,
      description: req.body.description,
    };

    skills.push(skill);
    res.status(200).send(skill);
  } catch (err) {
    console.error("POST /api/skills failed:", err);
    res.status(500).send({ error: "Server error adding skill." });
  }
});

/* -------------------- Validation -------------------- */
const validateSkill = (skill) => {
  const schema = Joi.object({
    _id: Joi.allow(""),
    title: Joi.string().min(3).required(),
    category: Joi.string().min(2).required(),
    level: Joi.string().valid("Beginner", "Intermediate", "Advanced").required(),
    lessons: Joi.number().required().min(1).max(20),
    instructor: Joi.string().min(2).required(),
    description: Joi.string().min(10).max(200).required(),
  });

  return schema.validate(skill);
};

/* -------------------- Start Server -------------------- */
const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});