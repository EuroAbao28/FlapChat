const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const userModel = require("../models/userModel");

const getUserToChat = async (req, res) => {
  try {
    const userID = req.params.id;

    if (!userID)
      return res.status(400).json({ message: "No id is passed in params" });

    const user = await userModel
      .findOne({ _id: userID })
      .select(["_id", "email", "username", "avatarImage"]);

    if (!user) return res.status(400).json({ message: "No user found" });

    res.status(200).json(user);
  } catch (error) {
    console.log(error);
    res.json(error);
  }
};

const checkUser = async (req, res) => {
  try {
    const { userToken } = req.body;

    if (!userToken)
      return res.status(400).json({ message: "From API: No token" });

    jwt.verify(userToken, process.env.JWT_SECRET, async (error, decoded) => {
      if (error) {
        return res
          .status(400)
          .json({ messasge: `JWT verification failed: ${error}` });
      }

      try {
        const isUserExist = await userModel
          .findOne({ email: decoded.email })
          .select(["username", "email", "avatarImage", "_id"]);

        if (!isUserExist)
          return res
            .status(404)
            .json({ message: "Token is valid, user not found" });

        res.status(200).json({
          message: "This user is verified",
          userDetails: isUserExist,
        });
      } catch (error) {
        res.status(500).json({ message: error });
      }
    });
  } catch (error) {
    console.log(error);
    res.json(error);
  }
};

const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password)
      return res.status(400).json({ message: "All fields required" });

    const usernameCheck = await userModel.findOne({ username });
    if (usernameCheck)
      return res.status(400).json({ message: "Username already used" });

    const emailCheck = await userModel.findOne({ email });
    if (emailCheck)
      return res.status(400).json({ message: "Email already used" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await userModel.create({
      username,
      email,
      password: hashedPassword,
    });

    if (newUser) {
      res.status(201).json({
        message: "Registered successfully",
        id: newUser._id,
        email: newUser.email,
        token: generateToken(newUser),
      });
    }
  } catch (error) {
    console.log(error);
    res.json(error);
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ message: "All fields required" });

    // Find user from db
    const user = await userModel.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      return res.status(200).json({
        message: "Login successfully",
        token: generateToken(user),
      });
    } else {
      return res.status(400).json({ message: "Incorrect email or password" });
    }
  } catch (error) {
    console.log(error);
    res.json(error);
  }
};

const setAvatar = async (req, res) => {
  try {
    const userID = req.params.id;
    const avatarImage = req.body.image;

    const user = await userModel.findByIdAndUpdate(userID, {
      isAvatarImageSet: true,
      avatarImage,
    });

    res.status(201).json({
      message: "Avatar has been set",
    });
  } catch (error) {
    console.log(error);
    res.json(error);
  }
};

const getAllUsers = async (req, res) => {
  try {
    const userID = req.params.id;
    const users = await userModel
      .find({ _id: { $ne: userID } })
      .select(["_id", "email", "username", "avatarImage"]);
    return res.status(200).json(users);
  } catch (error) {
    console.log(error);
    res.json(error);
  }
};

// Generate JWT
const generateToken = (userPayload) => {
  const { id, username, email } = userPayload;
  return jwt.sign({ id, username, email }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

module.exports = {
  checkUser,
  register,
  login,
  setAvatar,
  getAllUsers,
  getUserToChat,
};
