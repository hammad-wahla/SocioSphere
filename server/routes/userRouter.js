const router = require("express").Router();
const auth = require("../middleware/auth");
const userCtrl = require("../controllers/userCtrl");

router.get("/search", auth, userCtrl.searchUser);

router.get("/user/:id", auth, userCtrl.getUser);

router.patch("/user", auth, userCtrl.updateUser);
router.patch("/user/theme", auth, userCtrl.updateTheme);

router.patch("/user/:id/follow", auth, userCtrl.follow);
router.patch("/user/:id/unfollow", auth, userCtrl.unfollow);

// Follow request endpoints
router.patch("/user/:id/accept-follow", auth, userCtrl.acceptFollowRequest);
router.patch("/user/:id/reject-follow", auth, userCtrl.rejectFollowRequest);
router.patch("/user/:id/cancel-follow", auth, userCtrl.cancelFollowRequest);
router.get("/follow-requests", auth, userCtrl.getFollowRequests);

router.get("/suggestionsUser", auth, userCtrl.suggestionsUser);

module.exports = router;
