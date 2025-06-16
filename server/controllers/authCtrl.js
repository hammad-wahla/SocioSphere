const Users = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const {
  sendVerificationEmail,
  sendWelcomeEmail,
} = require("../config/emailService");

const authCtrl = {
  register: async (req, res) => {
    try {
      const { fullname, username, email, password, gender } = req.body;
      let newUserName = username.toLowerCase().replace(/ /g, "");

      const user_name = await Users.findOne({ username: newUserName });
      if (user_name)
        return res.status(400).json({ msg: "This user name already exists." });

      const user_email = await Users.findOne({ email });
      if (user_email)
        return res.status(400).json({ msg: "This email already exists." });

      if (password.length < 6)
        return res
          .status(400)
          .json({ msg: "Password must be at least 6 characters." });

      const passwordHash = await bcrypt.hash(password, 12);

      // Generate email verification token
      const emailVerificationToken = crypto.randomBytes(32).toString("hex");

      const newUser = new Users({
        fullname,
        username: newUserName,
        email,
        password: passwordHash,
        gender,
        isEmailVerified: false,
        emailVerificationToken,
      });

      await newUser.save();

      // Send verification email
      const emailSent = await sendVerificationEmail(
        email,
        emailVerificationToken,
        fullname
      );

      if (!emailSent) {
        return res.status(500).json({
          msg: "User registered but failed to send verification email. Please try resending verification email.",
        });
      }

      res.json({
        msg: "Registration successful! Please check your email to verify your account.",
        email: email,
        needsVerification: true,
      });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  verifyEmail: async (req, res) => {
    try {
      const { token } = req.params;
      console.log("Received verification request for token:", token);

      if (!token) {
        console.log("No token provided in request");
        return res.status(400).json({ msg: "Verification token is required." });
      }

      console.log("Looking for user with verification token:", token);
      const user = await Users.findOne({ emailVerificationToken: token });

      if (!user) {
        console.log("No user found with token:", token);
        return res
          .status(400)
          .json({ msg: "Invalid or expired verification token." });
      }

      console.log(
        "User found:",
        user.email,
        "Already verified:",
        user.isEmailVerified
      );

      if (user.isEmailVerified) {
        console.log("Email already verified for user:", user.email);
        return res.status(400).json({ msg: "Email is already verified." });
      }

      // Update user verification status
      console.log("Updating user verification status for:", user.email);
      user.isEmailVerified = true;
      user.emailVerificationToken = "";
      await user.save();

      console.log("User verification updated successfully");

      // Send welcome email
      console.log("Sending welcome email to:", user.email);
      await sendWelcomeEmail(user.email, user.fullname);

      // Generate tokens for automatic login after verification
      const access_token = createAccessToken({ id: user._id });
      const refresh_token = createRefreshToken({ id: user._id });

      console.log("Generated tokens for user:", user.email);

      res.cookie("refreshtoken", refresh_token, {
        httpOnly: true,
        path: "/api/refresh_token",
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30days
      });

      console.log("Sending success response");
      res.json({
        msg: "Email verified successfully! Welcome to SocioSphere!",
        access_token,
        user: {
          ...user._doc,
          password: "",
        },
      });
    } catch (err) {
      console.error("Error in verifyEmail:", err);
      return res.status(500).json({ msg: err.message });
    }
  },

  resendVerification: async (req, res) => {
    try {
      const { email } = req.body;

      if (!email) {
        return res.status(400).json({ msg: "Email is required." });
      }

      const user = await Users.findOne({ email });

      if (!user) {
        return res
          .status(400)
          .json({ msg: "User with this email does not exist." });
      }

      if (user.isEmailVerified) {
        return res.status(400).json({ msg: "Email is already verified." });
      }

      // Generate new verification token
      const emailVerificationToken = crypto.randomBytes(32).toString("hex");
      user.emailVerificationToken = emailVerificationToken;
      await user.save();

      // Send verification email
      const emailSent = await sendVerificationEmail(
        email,
        emailVerificationToken,
        user.fullname
      );

      if (!emailSent) {
        return res.status(500).json({
          msg: "Failed to send verification email. Please try again later.",
        });
      }

      res.json({
        msg: "Verification email sent successfully! Please check your email.",
      });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      const user = await Users.findOne({ email }).populate(
        "followers following",
        "avatar username fullname followers following"
      );

      if (!user)
        return res.status(400).json({ msg: "This email does not exist." });

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch)
        return res.status(400).json({ msg: "Password is incorrect." });

      // Check if email is verified
      if (!user.isEmailVerified) {
        return res.status(400).json({
          msg: "Please verify your email before logging in.",
          needsVerification: true,
          email: user.email,
        });
      }

      const access_token = createAccessToken({ id: user._id });
      const refresh_token = createRefreshToken({ id: user._id });

      res.cookie("refreshtoken", refresh_token, {
        httpOnly: true,
        path: "/api/refresh_token",
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30days
      });

      res.json({
        msg: "Login Success!",
        access_token,
        user: {
          ...user._doc,
          password: "",
        },
      });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  logout: async (req, res) => {
    try {
      res.clearCookie("refreshtoken", { path: "/api/refresh_token" });
      return res.json({ msg: "Logged out!" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  generateAccessToken: async (req, res) => {
    try {
      const rf_token = req.cookies.refreshtoken;
      if (!rf_token) return res.status(400).json({ msg: "Please login now." });

      jwt.verify(
        rf_token,
        process.env.REFRESH_TOKEN_SECRET,
        async (err, result) => {
          if (err) return res.status(400).json({ msg: "Please login now." });

          const user = await Users.findById(result.id)
            .select("-password")
            .populate(
              "followers following",
              "avatar username fullname followers following"
            );

          if (!user)
            return res.status(400).json({ msg: "This does not exist." });

          const access_token = createAccessToken({ id: result.id });

          res.json({
            access_token,
            user,
          });
        }
      );
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
};

const createAccessToken = (payload) => {
  return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "1d",
  });
};

const createRefreshToken = (payload) => {
  return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "30d",
  });
};

module.exports = authCtrl;
