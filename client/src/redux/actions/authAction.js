import { GLOBALTYPES } from "./globalTypes";
import { postDataAPI, patchDataAPI } from "../../utils/fetchData";
import valid from "../../utils/valid";

export const login = (data) => async (dispatch) => {
  try {
    dispatch({ type: GLOBALTYPES.ALERT, payload: { loading: true } });
    const res = await postDataAPI("login", data);

    // Check if email verification is needed
    if (res.data.needsVerification) {
      dispatch({
        type: GLOBALTYPES.ALERT,
        payload: {
          error: res.data.msg,
          needsVerification: true,
          email: res.data.email,
        },
      });
      return;
    }

    const authData = {
      token: res.data.access_token,
      user: res.data.user,
    };

    dispatch({
      type: GLOBALTYPES.AUTH,
      payload: authData,
    });

    // Set theme from user data
    if (res.data.user.theme) {
      dispatch({
        type: GLOBALTYPES.THEME,
        payload: res.data.user.theme === "dark",
      });
    }

    localStorage.setItem("firstLogin", true);
    localStorage.setItem("authData", JSON.stringify(authData));

    dispatch({
      type: GLOBALTYPES.ALERT,
      payload: {
        success: res.data.msg,
      },
    });
  } catch (err) {
    dispatch({
      type: GLOBALTYPES.ALERT,
      payload: {
        error: err.response.data.msg,
      },
    });
  }
};

export const refreshToken = () => async (dispatch) => {
  const firstLogin = localStorage.getItem("firstLogin");
  const storedAuthData = localStorage.getItem("authData");

  // If we have stored auth data, restore it first
  if (storedAuthData && firstLogin) {
    try {
      const authData = JSON.parse(storedAuthData);
      dispatch({
        type: GLOBALTYPES.AUTH,
        payload: authData,
      });
      
      // Restore theme from user data
      if (authData.user && authData.user.theme) {
        dispatch({
          type: GLOBALTYPES.THEME,
          payload: authData.user.theme === "dark",
        });
      }
    } catch (err) {
      // If stored data is corrupted, clear it
      localStorage.removeItem("authData");
    }
  }

  if (firstLogin) {
    dispatch({ type: GLOBALTYPES.ALERT, payload: { loading: true } });

    try {
      const res = await postDataAPI("refresh_token");

      const authData = {
        token: res.data.access_token,
        user: res.data.user,
      };

      dispatch({
        type: GLOBALTYPES.AUTH,
        payload: authData,
      });

      // Set theme from user data
      if (res.data.user.theme) {
        dispatch({
          type: GLOBALTYPES.THEME,
          payload: res.data.user.theme === "dark",
        });
      }

      // Update stored auth data
      localStorage.setItem("authData", JSON.stringify(authData));

      dispatch({ type: GLOBALTYPES.ALERT, payload: {} });
    } catch (err) {
      // Clear authentication state and localStorage when refresh fails
      localStorage.removeItem("firstLogin");
      localStorage.removeItem("authData");
      dispatch({
        type: GLOBALTYPES.AUTH,
        payload: {},
      });
      dispatch({
        type: GLOBALTYPES.ALERT,
        payload: {
          error:
            err.response?.data?.msg || "Session expired. Please login again.",
        },
      });
    }
  }
};

export const register = (data) => async (dispatch) => {
  const check = valid(data);
  if (check.errLength > 0)
    return dispatch({ type: GLOBALTYPES.ALERT, payload: check.errMsg });

  try {
    dispatch({ type: GLOBALTYPES.ALERT, payload: { loading: true } });

    const res = await postDataAPI("register", data);

    // Handle email verification flow
    if (res.data.needsVerification) {
      dispatch({
        type: GLOBALTYPES.ALERT,
        payload: {
          success: res.data.msg,
          needsVerification: true,
          email: res.data.email,
        },
      });
      return;
    }

    // If no verification needed (fallback for existing users)
    const authData = {
      token: res.data.access_token,
      user: res.data.user,
    };

    dispatch({
      type: GLOBALTYPES.AUTH,
      payload: authData,
    });

    // Set theme from user data
    if (res.data.user.theme) {
      dispatch({
        type: GLOBALTYPES.THEME,
        payload: res.data.user.theme === "dark",
      });
    }

    localStorage.setItem("firstLogin", true);
    localStorage.setItem("authData", JSON.stringify(authData));

    dispatch({
      type: GLOBALTYPES.ALERT,
      payload: {
        success: res.data.msg,
      },
    });
  } catch (err) {
    dispatch({
      type: GLOBALTYPES.ALERT,
      payload: {
        error: err.response.data.msg,
      },
    });
  }
};

// Add resend verification email action
export const resendVerification = (email) => async (dispatch) => {
  try {
    dispatch({ type: GLOBALTYPES.ALERT, payload: { loading: true } });

    const res = await postDataAPI("resend-verification", { email });

    dispatch({
      type: GLOBALTYPES.ALERT,
      payload: {
        success: res.data.msg,
      },
    });
  } catch (err) {
    dispatch({
      type: GLOBALTYPES.ALERT,
      payload: {
        error: err.response.data.msg,
      },
    });
  }
};

export const logout = () => async (dispatch) => {
  try {
    localStorage.removeItem("firstLogin");
    localStorage.removeItem("authData");
    await postDataAPI("logout");
    window.location.href = "/";
  } catch (err) {
    dispatch({
      type: GLOBALTYPES.ALERT,
      payload: {
        error: err.response.data.msg,
      },
    });
  }
};

export const updateProfile = (userData, auth) => async (dispatch) => {
  try {
    dispatch({ type: GLOBALTYPES.ALERT, payload: { loading: true } });

    const res = await patchDataAPI("user", userData, auth.token);

    const updatedAuthData = {
      ...auth,
      user: {
        ...auth.user,
        ...res.data.user,
      },
    };

    dispatch({
      type: GLOBALTYPES.AUTH,
      payload: updatedAuthData,
    });

    // Update stored auth data
    localStorage.setItem("authData", JSON.stringify(updatedAuthData));

    dispatch({
      type: GLOBALTYPES.ALERT,
      payload: {
        success: "Profile updated successfully!",
      },
    });
  } catch (err) {
    dispatch({
      type: GLOBALTYPES.ALERT,
      payload: {
        error: err.response.data.msg,
      },
    });
  }
};
