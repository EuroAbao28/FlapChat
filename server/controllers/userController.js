const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const userModel = require("../models/userModel");

const addFriend = async (req, res) => {
  try {
    const userId = req.params.id;
    const { friendId } = req.body;

    if (!userId || !friendId) {
      return res
        .status(400)
        .json({ message: "User id and friend id are required" });
    }

    const user = await userModel.findById(userId);
    const friend = await userModel.findById(friendId);

    if (!user || !friend) {
      return res.status(404).json({ message: "User or friend not found." });
    }

    if (!user.friends.includes(friendId)) {
      user.friends.push(friendId);
      await user.save();

      res.status(200).json({ message: "Added to contact." });
    } else {
      res
        .status(400)
        .json({ message: "Friend is already in the user's friends list." });
    }
  } catch (error) {
    console.log(error);
    res.json(error);
  }
};

const removeFriend = async (req, res) => {
  try {
    const userId = req.params.id;
    const { friendId } = req.body;

    if (!userId || !friendId) {
      return res
        .status(400)
        .json({ message: "User id and friend id are required" });
    }

    const updatedFriends = await userModel.findOneAndUpdate(
      { _id: userId },
      { $pull: { friends: friendId } },
      { new: true }
    );

    res.status(200).json({
      message: "Removed successfully",
    });
  } catch (error) {
    console.log(error);
    res.json(error);
  }
};

const searchUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const { searchInput } = req.body;

    if (!searchInput || !userId)
      return res
        .status(400)
        .json({ message: "User id and search input is required" });

    // get the user current friends to filter in searching
    const user = await userModel.findById(userId);

    // check muna kung merong user tugma sa pinasa sa params id
    if (!user) return res.status(404).json({ message: "No user found" });

    // this const is array because of the map method
    // ang laman nya ay mga id, parang ganto
    // "sampleID123", "sampleID098"
    const friendsToExclude = user.friends.map((friend) => friend._id);

    const results = await userModel.find({
      username: new RegExp(searchInput, "i"),
      // $ne = "not equal" sa id ng current user galing sa params
      // $nin = "not in" that const, basically ganto. wag mo isama itong mga nandito na mga id
      _id: { $ne: userId, $nin: friendsToExclude },
    });

    if (!results) {
      res.status(404).json({ message: "No user found" });
    }

    res.status(200).json(results);
  } catch (error) {
    console.log(error);
    res.json(error);
  }
};

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
          .populate({
            path: "friends",
            model: "User",
            select: ["username", "email", "avatarImage", "_id", "friends"],
          })
          .select(["username", "email", "avatarImage", "_id", "friends"]);

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
  searchUser,
  checkUser,
  register,
  login,
  setAvatar,
  getAllUsers,
  getUserToChat,
  addFriend,
  removeFriend,
};
