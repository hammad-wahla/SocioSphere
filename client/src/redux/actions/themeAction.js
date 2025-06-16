import { GLOBALTYPES } from "./globalTypes";
import { patchDataAPI } from "../../utils/fetchData";

export const updateTheme = (theme, auth) => async (dispatch) => {
  try {
    dispatch({
      type: GLOBALTYPES.THEME,
      payload: theme === "dark",
    });

    // Save theme to database
    const res = await patchDataAPI("user/theme", { theme }, auth.token);

    // Update user data in auth state
    const updatedAuthData = {
      ...auth,
      user: {
        ...auth.user,
        theme: res.data.user.theme,
      },
    };

    dispatch({
      type: GLOBALTYPES.AUTH,
      payload: updatedAuthData,
    });

    // Update stored auth data
    localStorage.setItem("authData", JSON.stringify(updatedAuthData));
  } catch (err) {
    dispatch({
      type: GLOBALTYPES.ALERT,
      payload: {
        error: err.response?.data?.msg || "Failed to update theme",
      },
    });
  }
};