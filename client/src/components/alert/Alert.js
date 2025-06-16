import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { GLOBALTYPES } from "../../redux/actions/globalTypes";

import Loading from "./Loading";
import Toast from "./Toast";
import ConfirmModal from "./ConfirmModal";

const Notify = () => {
  const { alert } = useSelector((state) => state);
  const dispatch = useDispatch();

  useEffect(() => {
    const timeout = setTimeout(() => {
      dispatch({ type: GLOBALTYPES.ALERT, payload: {} });
    }, 3000); // 3000 milliseconds = 3 seconds for better readability

    return () => clearTimeout(timeout);
  }, [alert, dispatch]);

  return (
    <div>
      {alert.loading && <Loading />}

      {alert.error && (
        <Toast
          msg={{ title: "Error", body: alert.error }}
          handleShow={() => dispatch({ type: GLOBALTYPES.ALERT, payload: {} })}
          bgColor="bg-danger"
        />
      )}

      {alert.success && (
        <Toast
          msg={{ title: "Success", body: alert.success }}
          handleShow={() => dispatch({ type: GLOBALTYPES.ALERT, payload: {} })}
          bgColor="bg-success"
        />
      )}

      {alert.confirm && (
        <ConfirmModal
          show={true}
          title={alert.confirm.title}
          message={alert.confirm.message}
          confirmText={alert.confirm.confirmText}
          cancelText={alert.confirm.cancelText}
          confirmVariant={alert.confirm.variant}
          onConfirm={alert.confirm.onConfirm}
          onClose={() => dispatch({ type: GLOBALTYPES.ALERT, payload: {} })}
        />
      )}
    </div>
  );
};

export default Notify;
