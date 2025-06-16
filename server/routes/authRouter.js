const router = require("express").Router();
const authCtrl = require("../controllers/authCtrl");

router.post("/register", authCtrl.register);

router.post("/login", authCtrl.login);

router.post("/logout", authCtrl.logout);

router.post("/refresh_token", authCtrl.generateAccessToken);

// Email verification routes
router.get("/verify-email/:token", authCtrl.verifyEmail);

router.post("/resend-verification", authCtrl.resendVerification);

module.exports = router;
