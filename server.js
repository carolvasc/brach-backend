require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
const cors = require("cors");

const port = 3000;

const app = express();
app.use(bodyParser.json());

app.use(
  cors({
    origin: "http://127.0.0.1:5500", // Substitua pela URL do seu frontend, se necessário
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
  })
);

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

app.post("/send-email", (req, res) => {
  const { name, email, phone, message } = req.body;

  const mailOptions = {
    from: email,
    to: process.env.EMAIL_USER,
    subject: `Eba! Uma nova mensagem de ${name} para você!`,
    text: `Nome: ${name}\nE-mail: ${email}\nTelefone: ${phone}\n\nMensagem:\n${message}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      res.status(500).json({ error: "Error sending email" });
    } else {
      console.log("Email sent: " + info.response);
      res.status(200).json({ message: "Email sent" });
    }
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
