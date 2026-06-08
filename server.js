require("dotenv").config();

const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");

const app = express();

app.use(cors());
app.use(express.json());

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
});

console.log("EMAIL =", process.env.EMAIL);
console.log("PASSWORD =", process.env.PASSWORD ? "FOUND" : "NOT FOUND");
console.log("SMTP PORT = 465");

transporter.verify(function (error, success) {
  if (error) {
    console.log("SMTP ERROR:", error);
  } else {
    console.log("SMTP READY");
  }
});

app.post("/send", async (req, res) => {
  console.log("Request received");
  console.log(req.body);

  const { name, email, message } = req.body;

  try {
    await transporter.sendMail({
      from: process.env.EMAIL,
      to: process.env.EMAIL,
      replyTo: email,
      subject: `Portfolio Message from ${name}`,
      text: message,
    });

    res.status(200).send("Message Sent");
  } catch (error) {
    console.log("ERROR:", error);
    res.status(500).send(error.message);
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});