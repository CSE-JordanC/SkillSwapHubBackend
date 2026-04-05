const express = require("express");
const cors = require("cors");
const multer = require("multer");
const app = express();
app.use(express.static("public"));
app.use(express.json());
app.use(cors());

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/images/");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

let skills = [
  {
    "_id": 1,
    "title": "Guitar Basics",
    "img_name": "guitarbasics.png",
    "category": "Music",
    "level": "Beginner",
    "lessons": 6,
    "instructor": "Alex M.",
    "description": "Open chords, strumming patterns, and 3 easy songs."
  },
  {
    "_id": 2,
    "title": "Intro to Web Design",
    "img_name": "introtoweb.png",
    "category": "Tech",
    "level": "Intermediate",
    "lessons": 8,
    "instructor": "Priya S.",
    "description": "HTML/CSS fundamentals and simple responsive layout."
  },
  {
    "_id": 3,
    "title": "Personal Fitness",
    "img_name": "personalfitness.png",
    "category": "Health",
    "level": "Advanced",
    "lessons": 10,
    "instructor": "Rafael K.",
    "description": "Strength, mobility, and tailored home workouts."
  },
  {
    "_id": 4,
    "title": "Digital Photography",
    "img_name": "digitalphotography.png",
    "category": "Creative",
    "level": "Beginner",
    "lessons": 5,
    "instructor": "Jamie L.",
    "description": "Basic camera settings, composition, and editing tips."
  },
  {
    "_id": 5,
    "title": "Spanish Basics",
    "img_name": "spanishbasics.png",
    "category": "Language",
    "level": "Beginner",
    "lessons": 6,
    "instructor": "María R.",
    "description": "Everyday phrases, pronunciation, and short dialogues."
  },
  {
    "_id": 6,
    "title": "Intro to Painting",
    "img_name": "introtopainting.png",
    "category": "Art",
    "level": "Beginner",
    "lessons": 4,
    "instructor": "C. Nguyen",
    "description": "Watercolor basics and easy still-life exercises."
  },
  {
    "_id": 7,
    "title": "Songwriting Essentials",
    "img_name": "songwriting_essentials.png",
    "category": "Music",
    "level": "Intermediate",
    "lessons": 4,
    "instructor": "Alex M.",
    "description": "Structure, melody, and lyric writing exercises for original songs."
  },
  {
    "_id": 8,
    "title": "Portrait Lighting Basics",
    "img_name": "portrait_lighting.png",
    "category": "Creative",
    "level": "Beginner",
    "lessons": 3,
    "instructor": "Jamie L.",
    "description": "Simple lighting setups for flattering portraits using natural and artificial light."
  },
  {
    "_id": 9,
    "title": "Intro to Adobe Illustrator",
    "img_name": "intro_to_illustrator.png",
    "category": "Tech",
    "level": "Beginner",
    "lessons": 6,
    "instructor": "Priya S.",
    "description": "Vector basics: shapes, pen tool, type, and exporting assets for web."
  }
]

app.get("/api/skills", (req,res)=>{
  res.send(skills);
});

app.get("/api/skills/:id", (req,res)=>{
  const skill=skills.find((h)=>h._id===parseInt(req.params.id));
  res.send(skill);
});

//listen for incoming requests
app.listen(3001, ()=>{
  console.log("Server is up and running");
});