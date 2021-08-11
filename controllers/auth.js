import User from "../models/user";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  console.log(req.body);
  const { name, email, password } = req.body;
  if (!name) return res.status(400).send("Name is required");
  if (!password || password.length < 6)
    return res
      .status(400)
      .send("Password is required and should be min 6 characters long");
  let userExist = await User.findOne({ email }).exec();
  if (userExist) return res.status(400).send("Email is already registered");

  const user = new User(req.body);
  try {
    await user.save();
    //console.log("user created", user);
    return res.json({ ok: true });
  } catch (err) {
    console.log("Registration failed :", err);
    return res.status(400).send("registration failed, please try again");
  }
};

export const login = async (req, res) => {
  // console.log(req.body);
  const { email, password } = req.body;
  let user;
  try {
    user = await User.findOne({ email }).exec();
    // console.log("USER", user);
    if (!user) res.status(400).send("User doesn't exist");

    user.comparePassword(password, (err, match) => {
      // console.log("compare password", err);
      if (!match || err) return res.status(400).send("Wrong password");
      let token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "7d",
      });
      res.json({
        token,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
          stripe_account_id: user.stripe_account_id,
          stripe_seller: user.stripe_seller,
          stripeSession: user.stripeSession,
        },
      });
    });
  } catch (err) {
    res.status(400).send("Login Failed");
  }
};
