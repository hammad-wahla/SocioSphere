import { GLOBALTYPES } from "../redux/actions/globalTypes";

export const showConfirmDialog = (dispatch, options) => {
  const {
    title = "Confirm Action",
    message = "Are you sure you want to continue?",
    confirmText = "Confirm",
    cancelText = "Cancel",
    variant = "danger", // danger, success, primary, warning
    onConfirm = () => {},
  } = options;

  dispatch({
    type: GLOBALTYPES.ALERT,
    payload: {
      confirm: {
        title,
        message,
        confirmText,
        cancelText,
        variant,
        onConfirm,
      },
    },
  });
};

export const showToast = (dispatch, options) => {
  const {
    type = "success", // success, error, info, warning
    message,
    duration = 3000,
  } = options;

  dispatch({
    type: GLOBALTYPES.ALERT,
    payload: {
      [type]: message,
    },
  });

  // Auto clear after duration
  setTimeout(() => {
    dispatch({ type: GLOBALTYPES.ALERT, payload: {} });
  }, duration);
};
