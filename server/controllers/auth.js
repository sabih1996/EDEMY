import User from "../models/user";
import { hashPassword, comparePassword } from "../utils/auth";
import jwt from "jsonwebtoken";
import { nanoid } from "nanoid";
import sendEmail from "../utils/emailService";

export const register = async (req, res) => {
  try {
    // console.log(req.body);
    const { name, email, password } = req.body;
    // validation
    if (!name) return res.status(400).send("Name is required");
    if (!password || password.length < 6) {
      return res
        .status(400)
        .send("Password is required and should be min 6 characters long");
    }
    let userExist = await User.findOne({ email }).exec();
    if (userExist) return res.status(400).send("Email is taken");

    // hash password
    const hashedPassword = await hashPassword(password);

    // register
    const user = new User({
      name,
      email,
      password: hashedPassword,
    });
    await user.save();
    res.status(200).json({ user: user, token: token });
  } catch (err) {
    console.log(err);
    return res.status(400).send("Error. Try again.");
  }
};

export const login = async (req, res) => {
  try {
    // console.log(req.body);
    const { email, password } = req.body;
    // check if our db has user with that email
    const user = await User.findOne({ email }).exec();
    if (!user) return res.status(400).send("No user found");
    // check password
    const match = await comparePassword(password, user.password);
    if (!match) return res.status(400).send("Wrong password");

    // create signed jwt
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    // return user and token to client, exclude hashed password
    user.password = undefined;
    // send token in cookie
    res.cookie("token", token, {
      httpOnly: true,
      // secure: true, // only works on https
    });
    // send user as json response
    res.status(200).json({ user: user, token: token });
  } catch (err) {
    console.log(err);
    return res.status(400).send("Error. Try again.");
  }
};

export const logout = async (req, res) => {
  try {
    res.clearCookie("token");
    return res.json({ message: "Signout success" });
  } catch (err) {
    console.log(err);
  }
};

export const currentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password").exec();
    console.log("CURRENT_USER", user);
    return res.json({ ok: true });
  } catch (err) {
    console.log(err);
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    // console.log(email);
    const shortCode = nanoid(6).toUpperCase();
    const user = await User.findOneAndUpdate(
      { email },
      { passwordResetCode: shortCode }
    );
    if (!user) return res.status(400).send("User not found");
    // Create reset url
    const resetUrl = `${req.protocol}://${req.get(
      "host"
    )}/api/v1/auth/resetpassword`;

    const message = `You are receiving this email because you (or someone else) has requested the reset of a password. Please make a PUT request to: \n\n ${resetUrl} \n\n Your code is: ${shortCode}`;
    await sendEmail({
      email: email,
      subject: "Password reset token",
      message,
    });
  } catch (err) {
    console.log(err);
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { email, code, newPassword } = req.body;
    // console.table({ email, code, newPassword });
    const hashedPassword = await hashPassword(newPassword);

    const user = User.findOneAndUpdate(
      {
        email,
        passwordResetCode: code,
      },
      {
        password: hashedPassword,
        passwordResetCode: "",
      }
    ).exec();
    res.json({ ok: true });
  } catch (err) {
    console.log(err);
    return res.status(400).send("Error! Try again.");
  }
};
