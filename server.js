require("dotenv").config();

const express = require("express");
const cors = require("cors");
const multer = require("multer");
const Joi = require("joi");
const mongoose = require("mongoose");
const fs = require("fs");

const app = express();

/* -------------------- CORS -------------------- */
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://cse-jordanc.github.io",
    ],
  })
);

/* -------------------- Middleware -------------------- */
app.use(express.json());
app.use(express.static("public"));

/* Ensure image folder exists */
fs.mkdirSync("./public/images", { recursive: true });

/* -------------------- Multer -------------------- */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/images/");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

/* -------------------- MongoDB -------------------- */
mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("Connected to MongoDB");
    await seedSkills();
  })
  .catch((err) => console.log("MongoDB connection error:", err));

/* -------------------- Schema -------------------- */
const skillSchema = new mongoose.Schema({
  title: String,
  img_name: String,
  category: String,
  level: String,
  lessons: Number,
  instructor: String,
  description: String,
});

const Skill = mongoose.model("Skill", skillSchema);

/* -------------------- Seed Data -------------------- */
const seedSkills = async () => {
  const count = await Skill.countDocuments();

  if (count === 0) {
    console.log("Seeding database...");

    const defaultSkills = [
      {
        title: "Guitar Basics",
        img_name: "guitarbasics.png",
        category: "Music",
        level: "Beginner",
        lessons: 6,
        instructor: "Alex M.",
        description: "Open chords, strumming patterns, and 3 easy songs.",
      },
      {
        title: "Intro to Web Design",
        img_name: "introtoweb.png",
        category: "Tech",
        level: "Intermediate",
        lessons: 8,
        instructor: "Priya S.",
        description: "HTML/CSS fundamentals and simple responsive layout.",
      },
      {
        title: "Personal Fitness",
        img_name: "personalfitness.png",
        category: "Health",
        level: "Advanced",
        lessons: 10,
        instructor: "Rafael K.",
        description: "Strength, mobility, and tailored home workouts.",
      },
      {
        title: "Digital Photography",
        img_name: "digitalphotography.png",
        category: "Creative",
        level: "Beginner",
        lessons: 5,
        instructor: "Jamie L.",
        description: "Basic camera settings, composition, and editing tips.",
      },
      {
        title: "Spanish Basics",
        img_name: "spanishbasics.png",
        category: "Language",
        level: "Beginner",
        lessons: 6,
        instructor: "María R.",
        description: "Everyday phrases, pronunciation, and short dialogues.",
      },
      {
        title: "Intro to Painting",
        img_name: "introtopainting.png",
        category: "Art",
        level: "Beginner",
        lessons: 4,
        instructor: "C. Nguyen",
        description: "Watercolor basics and easy still-life exercises.",
      },
      {
        title: "Songwriting Essentials",
        img_name: "songwriting_essentials.png",
        category: "Music",
        level: "Intermediate",
        lessons: 4,
        instructor: "Alex M.",
        description:
          "Structure, melody, and lyric writing exercises for original songs.",
      },
      {
        title: "Portrait Lighting Basics",
        img_name: "portrait_lighting.png",
        category: "Creative",
        level: "Beginner",
        lessons: 3,
        instructor: "Jamie L.",
        description:
          "Simple lighting setups for flattering portraits using natural and artificial light.",
      },
      {
        title: "Intro to Adobe Illustrator",
        img_name: "intro_to_illustrator.png",
        category: "Tech",
        level: "Beginner",
        lessons: 6,
        instructor: "Priya S.",
        description:
          "Vector basics: shapes, pen tool, type, and exporting assets for web.",
      },
    ];

    await Skill.insertMany(defaultSkills);
    console.log("Database seeded!");
  } else {
    console.log("Database already populated.");
  }
};

/* -------------------- Routes -------------------- */

// GET all
app.get("/api/skills", async (req, res) => {
  const skills = await Skill.find();
  res.send(skills);
});

// GET one
app.get("/api/skills/:id", async (req, res) => {
  const skill = await Skill.findById(req.params.id);

  if (!skill) {
    res.status(404).send({ error: "Skill not found" });
    return;
  }

  res.send(skill);
});

// POST
app.post("/api/skills", upload.single("img"), async (req, res) => {
  const result = validateSkill(req.body);

  if (result.error) {
    res.status(400).send({ error: result.error.details[0].message });
    return;
  }

  if (!req.file) {
    res.status(400).send({ error: "Image is required." });
    return;
  }

  const skill = new Skill({
    title: req.body.title,
    img_name: req.file.filename,
    category: req.body.category,
    level: req.body.level,
    lessons: Number(req.body.lessons),
    instructor: req.body.instructor,
    description: req.body.description,
  });

  const newSkill = await skill.save();
  res.status(200).send(newSkill);
});

// PUT
app.put("/api/skills/:id", upload.single("img"), async (req, res) => {
  const result = validateSkill(req.body);

  if (result.error) {
    res.status(400).send({ error: result.error.details[0].message });
    return;
  }

  const fieldsToUpdate = {
    title: req.body.title,
    category: req.body.category,
    level: req.body.level,
    lessons: Number(req.body.lessons),
    instructor: req.body.instructor,
    description: req.body.description,
  };

  if (req.file) {
    fieldsToUpdate.img_name = req.file.filename;
  }

  const success = await Skill.updateOne(
    { _id: req.params.id },
    fieldsToUpdate
  );

  if (!success) {
    res.status(404).send("Skill not found");
  } else {
    const updatedSkill = await Skill.findById(req.params.id);
    res.status(200).send(updatedSkill);
  }
});

// DELETE
app.delete("/api/skills/:id", async (req, res) => {
  const skill = await Skill.findByIdAndDelete(req.params.id);

  if (!skill) {
    res.status(404).send("Skill not found");
    return;
  }

  res.status(200).send(skill);
});

/* -------------------- Validation -------------------- */
const validateSkill = (skill) => {
  const schema = Joi.object({
    title: Joi.string().min(3).required(),
    category: Joi.string().min(2).required(),
    level: Joi.string().valid("Beginner", "Intermediate", "Advanced").required(),
    lessons: Joi.number().min(1).max(20).required(),
    instructor: Joi.string().min(2).required(),
    description: Joi.string().min(10).max(200).required(),
  });

  return schema.validate(skill);
};

/* -------------------- Server -------------------- */
const port = process.env.PORT || 3001;
app.listen(port, "0.0.0.0", () => {
  console.log(`Server running on port ${port}`);
});