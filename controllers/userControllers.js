require("dotenv").config();
const AUTH0_HOOK_SECRET = process.env.AUTH0_HOOK_SECRET;
const nodemailer = require("nodemailer");
const db = require("../db/models/index");

const syncUsers = async (req, res) => {
  const { user, secret } = req.body;
  if (secret != AUTH0_HOOK_SECRET) {
    return res.status(401).json("Unauthorised");
  }
  try {
    const id = user.user_id.split("|")[1];
    const username = user.email.split("@")[0];
    const response = await db.User.create({
      id: id,
      username: username,
      email: user.email,
    });
    if (response) {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL,
          pass: process.env.EMAIL_PASSWORD,
        },
      });

      const mailOptions = {
        from: process.env.EMAIL,
        to: user.email,
        subject: "itineraX Registration",
        text: "You have successfully registered an account.",
      };

      const info = await transporter.sendMail(mailOptions);

      if (info) {
        res.status(200).json("Successfully created user.");
      }
    }
  } catch (error) {
    console.error(error);
    res.status(500).json("Internal Server Error");
  }
};

const editUser = async (req, res) => {
  const { username } = req.body;
  const auth0ID = req.auth.payload.sub;
  const id = auth0ID.split("|")[1];
  try {
    const response = await db.User.update(
      { username: username },
      { where: { id: id } }
    );
    if (response) {
      res.status(200).json("Successfully updated profile");
    }
  } catch (error) {
    console.erroe(error);
    res.status(500).json("Internal Server Error");
  }
};

module.exports = { syncUsers, editUser };
