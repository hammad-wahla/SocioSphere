import { GLOBALTYPES, DeleteData } from "./globalTypes";
import { getDataAPI, patchDataAPI } from "../../utils/fetchData";
import { imageUpload } from "../../utils/imageUpload";
import { createNotify, removeNotify } from "../actions/notifyAction";

export const PROFILE_TYPES = {
  LOADING: "LOADING_PROFILE",
  GET_USER: "GET_PROFILE_USER",
  FOLLOW: "FOLLOW",
  UNFOLLOW: "UNFOLLOW",
  FOLLOW_REQUEST_SENT: "FOLLOW_REQUEST_SENT",
  GET_ID: "GET_PROFILE_ID",
  GET_POSTS: "GET_PROFILE_POSTS",
  UPDATE_POST: "UPDATE_PROFILE_POST",
};

export const getProfileUsers =
  ({ id, auth }) =>
  async (dispatch) => {
    dispatch({ type: PROFILE_TYPES.GET_ID, payload: id });

    try {
      dispatch({ type: PROFILE_TYPES.LOADING, payload: true });
      const res = getDataAPI(`/user/${id}`, auth.token);
      const res1 = getDataAPI(`/user_posts/${id}`, auth.token);

      // Also refresh current user's data to get updated followRequests
      const currentUserRes = getDataAPI(`/user/${auth.user._id}`, auth.token);

      const users = await res;
      const posts = await res1;
      const currentUser = await currentUserRes;

      dispatch({
        type: PROFILE_TYPES.GET_USER,
        payload: users.data,
      });

      dispatch({
        type: PROFILE_TYPES.GET_POSTS,
        payload: { ...posts.data, _id: id, page: 2 },
      });

      // Update current user's data in auth to ensure followRequests are current
      if (currentUser.data.user) {
        dispatch({
          type: GLOBALTYPES.AUTH,
          payload: {
            ...auth,
            user: currentUser.data.user,
          },
        });
      }

      dispatch({ type: PROFILE_TYPES.LOADING, payload: false });
    } catch (err) {
      dispatch({
        type: GLOBALTYPES.ALERT,
        payload: { error: err.response.data.msg },
      });
    }
  };

export const updateProfileUser =
  ({ userData, avatar, auth }) =>
  async (dispatch) => {
    if (!userData.fullname)
      return dispatch({
        type: GLOBALTYPES.ALERT,
        payload: { error: "Please add your full name." },
      });

    if (userData.fullname.length > 25)
      return dispatch({
        type: GLOBALTYPES.ALERT,
        payload: { error: "Your full name too long." },
      });

    if (userData.story.length > 200)
      return dispatch({
        type: GLOBALTYPES.ALERT,
        payload: { error: "Your story too long." },
      });

    try {
      let media;
      dispatch({ type: GLOBALTYPES.ALERT, payload: { loading: true } });

      if (avatar) media = await imageUpload([avatar]);

      const res = await patchDataAPI(
        "user",
        {
          ...userData,
          avatar: avatar ? media[0].url : auth.user.avatar,
        },
        auth.token
      );

      dispatch({
        type: GLOBALTYPES.AUTH,
        payload: {
          ...auth,
          user: {
            ...auth.user,
            ...userData,
            avatar: avatar ? media[0].url : auth.user.avatar,
          },
        },
      });

      dispatch({ type: GLOBALTYPES.ALERT, payload: { success: res.data.msg } });
    } catch (err) {
      dispatch({
        type: GLOBALTYPES.ALERT,
        payload: { error: err.response.data.msg },
      });
    }
  };

export const follow =
  ({ users, user, auth, socket }) =>
  async (dispatch) => {
    try {
      const res = await patchDataAPI(
        `user/${user._id}/follow`,
        null,
        auth.token
      );

      // Handle private account follow request
      if (res.data.requestSent) {
        dispatch({
          type: GLOBALTYPES.ALERT,
          payload: { success: res.data.msg },
        });

        // Update user with pending request status
        let updatedUser;
        if (users.every((item) => item._id !== user._id)) {
          updatedUser = { ...user, followRequestSent: true };
        } else {
          users.forEach((item) => {
            if (item._id === user._id) {
              updatedUser = { ...item, followRequestSent: true };
            }
          });
        }

        dispatch({
          type: PROFILE_TYPES.FOLLOW_REQUEST_SENT,
          payload: updatedUser,
        });

        // Create notification for follow request
        const msg = {
          id: auth.user._id,
          text: "wants to follow you.",
          recipients: [user._id],
          url: `/profile/${auth.user._id}`,
        };

        dispatch(createNotify({ msg, auth, socket }));
        return;
      }

      // Handle regular follow (public account)
      let newUser;
      if (users.every((item) => item._id !== user._id)) {
        newUser = { ...user, followers: [...user.followers, auth.user] };
      } else {
        users.forEach((item) => {
          if (item._id === user._id) {
            newUser = { ...item, followers: [...item.followers, auth.user] };
          }
        });
      }

      dispatch({ type: PROFILE_TYPES.FOLLOW, payload: newUser });

      dispatch({
        type: GLOBALTYPES.AUTH,
        payload: {
          ...auth,
          user: { ...auth.user, following: [...auth.user.following, newUser] },
        },
      });

      // Show success toast
      dispatch({
        type: GLOBALTYPES.ALERT,
        payload: { success: `You are now following ${user.username}` },
      });

      socket.emit("follow", res.data.newUser);

      // Notify
      const msg = {
        id: auth.user._id,
        text: "has started to follow you.",
        recipients: [newUser._id],
        url: `/profile/${auth.user._id}`,
      };

      dispatch(createNotify({ msg, auth, socket }));
    } catch (err) {
      dispatch({
        type: GLOBALTYPES.ALERT,
        payload: { error: err.response.data.msg },
      });
    }
  };

export const unfollow =
  ({ users, user, auth, socket }) =>
  async (dispatch) => {
    let newUser;

    if (users.every((item) => item._id !== user._id)) {
      newUser = {
        ...user,
        followers: DeleteData(user.followers, auth.user._id),
      };
    } else {
      users.forEach((item) => {
        if (item._id === user._id) {
          newUser = {
            ...item,
            followers: DeleteData(item.followers, auth.user._id),
          };
        }
      });
    }

    dispatch({ type: PROFILE_TYPES.UNFOLLOW, payload: newUser });

    dispatch({
      type: GLOBALTYPES.AUTH,
      payload: {
        ...auth,
        user: {
          ...auth.user,
          following: DeleteData(auth.user.following, newUser._id),
        },
      },
    });

    // Show success toast
    dispatch({
      type: GLOBALTYPES.ALERT,
      payload: { success: `You have unfollowed ${user.username}` },
    });

    try {
      const res = await patchDataAPI(
        `user/${user._id}/unfollow`,
        null,
        auth.token
      );
      socket.emit("unFollow", res.data.newUser);

      // Notify
      const msg = {
        id: auth.user._id,
        text: "has started to follow you.",
        recipients: [newUser._id],
        url: `/profile/${auth.user._id}`,
      };

      dispatch(removeNotify({ msg, auth, socket }));
    } catch (err) {
      dispatch({
        type: GLOBALTYPES.ALERT,
        payload: { error: err.response.data.msg },
      });
    }
  };

// Accept follow request
export const acceptFollowRequest =
  ({ requesterId, auth, socket }) =>
  async (dispatch) => {
    try {
      const res = await patchDataAPI(
        `user/${requesterId}/accept-follow`,
        null,
        auth.token
      );

      dispatch({
        type: GLOBALTYPES.ALERT,
        payload: { success: res.data.msg },
      });

      // Update auth user with new follower and removed request
      dispatch({
        type: GLOBALTYPES.AUTH,
        payload: {
          ...auth,
          user: res.data.user,
        },
      });

      // Create notification for accepted follow request
      const msg = {
        id: auth.user._id,
        text: "accepted your follow request.",
        recipients: [requesterId],
        url: `/profile/${auth.user._id}`,
      };

      dispatch(createNotify({ msg, auth, socket }));
    } catch (err) {
      dispatch({
        type: GLOBALTYPES.ALERT,
        payload: { error: err.response.data.msg },
      });
    }
  };

// Reject follow request
export const rejectFollowRequest =
  ({ requesterId, auth }) =>
  async (dispatch) => {
    try {
      const res = await patchDataAPI(
        `user/${requesterId}/reject-follow`,
        null,
        auth.token
      );

      dispatch({
        type: GLOBALTYPES.ALERT,
        payload: { success: res.data.msg },
      });

      // Update auth user with removed request
      dispatch({
        type: GLOBALTYPES.AUTH,
        payload: {
          ...auth,
          user: res.data.user,
        },
      });
    } catch (err) {
      dispatch({
        type: GLOBALTYPES.ALERT,
        payload: { error: err.response.data.msg },
      });
    }
  };

// Cancel follow request
export const cancelFollowRequest =
  ({ users, user, auth, socket }) =>
  async (dispatch) => {
    try {
      const res = await patchDataAPI(
        `user/${user._id}/cancel-follow`,
        null,
        auth.token
      );

      dispatch({
        type: GLOBALTYPES.ALERT,
        payload: { success: res.data.msg },
      });

      // Update local user state to remove request sent status
      let updatedUser;
      if (users.every((item) => item._id !== user._id)) {
        updatedUser = { ...user, followRequestSent: false };
      } else {
        users.forEach((item) => {
          if (item._id === user._id) {
            updatedUser = { ...item, followRequestSent: false };
          }
        });
      }

      dispatch({
        type: PROFILE_TYPES.UNFOLLOW,
        payload: updatedUser,
      });

      // Update auth user to remove from pending requests
      dispatch({
        type: GLOBALTYPES.AUTH,
        payload: {
          ...auth,
          user: {
            ...auth.user,
            pendingRequests: auth.user.pendingRequests.filter(
              (id) => id !== user._id
            ),
          },
        },
      });

      // Remove the follow request notification
      const msg = {
        id: auth.user._id,
        text: "wants to follow you.",
        recipients: [user._id],
        url: `/profile/${auth.user._id}`,
      };

      dispatch(removeNotify({ msg, auth, socket }));
    } catch (err) {
      dispatch({
        type: GLOBALTYPES.ALERT,
        payload: { error: err.response.data.msg },
      });
    }
  };
