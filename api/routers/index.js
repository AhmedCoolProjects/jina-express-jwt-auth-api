import { Router } from "express";
import jsonwebtoken from "jsonwebtoken";
import Student from "../models/StudentSchema.js";
import {
  login,
  profile,
  register,
  sendEmailVerification,
} from "../controllers/studentController.js";

const router = Router();
const studentRouter = Router();

// Student
// Get All Students
studentRouter.get("/all", async (req, res) => {
  const students = await Student.find();
  res.send(students);
});
// Get Student by ID
studentRouter.get("/:id", async (req, res) => {
  const student = await Student.findById(req.params.id);
  res.send(student);
});
// Add Student
studentRouter.post("/", (req, res) => {
  register(req, res);
});
// Login Student
studentRouter.post("/login", (req, res) => {
  login(req, res);
});
// Profile Student
studentRouter.post("/profile", (req, res, next) => {
  profile(req, res, next);
});
// Update Student
studentRouter.post("/update/:id", async (req, res) => {
  const student = await Student.findOneAndUpdate(
    { _id: req.params.id },
    {
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      room_number: req.body.room_number,
    }
  );
  res.send(`Student ${student.first_name} ${student.last_name} updated`);
});
// Delete Student
studentRouter.post("/delete/:id", async (req, res) => {
  const student = await Student.findByIdAndDelete(req.params.id);
  res.send(`Student ${student.first_name} ${student.last_name} deleted`);
});
// Welcome
router.get("/", (req, res) => {
  res.send("Welcome to the JINA Express JWT Auth API");
});
// Send Email Verification
studentRouter.post("/sendemail", async (req, res) => {
  const _id = req.body._id;
  const student = await Student.findById(_id);

  const EMAIL_TOKEN = jsonwebtoken.sign(
    {
      data: student,
    },
    "ourSecretKey",
    { expiresIn: "10m" }
  );
  const MAIL_CONFIGURATION = {
    from: "bargadyahmed@gmail.com",
    to: student.email,
    // Subject of Email
    subject: "Jina ENIME | Email Verification",
    // This would be the text of email body
    text: `Hi! There, thanks for your interest in our services.
           Please follow the given link to verify your email
           https://jina-enime-backend.vercel.app/api/student/verify/${EMAIL_TOKEN},

           This link will expire in 10 minutes.
           Thanks`,
  };
  sendEmailVerification(MAIL_CONFIGURATION, res);
});

studentRouter.get("/verify/:token", (req, res) => {
  const { token } = req.params;
  // Verifing the JWT token
  jsonwebtoken.verify(token, "ourSecretKey", function (err, decoded) {
    if (err) {
      console.log(err);
      res.send(
        "Email verification failed ;(, possibly the link is invalid or expired"
      );
    } else {
      var student = decoded.data;
      // update student
      Student.findByIdAndUpdate(student._id, {
        $set: {
          email_verified: true,
        },
      })
        .then((studentNew) => {
          res.send(
            `Email verified for ${studentNew.first_name} ${studentNew.last_name} with email ${studentNew.email}`
          );
        })
        .catch((err) => {
          console.log(err);
          res.send(err);
        });
    }
  });
});

router.use("/student", studentRouter);

export default router;
