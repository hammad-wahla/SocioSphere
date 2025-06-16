import React from "react";
import Avatar from "../Avatar";
import { useSelector, useDispatch } from "react-redux";
import { GLOBALTYPES } from "../../redux/actions/globalTypes";

const Status = () => {
  const { auth } = useSelector((state) => state);
  const dispatch = useDispatch();

  return (
    <div
      className="status mb-3 d-flex "
      //  style={{width: "400px", margin: "auto"}}
    >
      <Avatar src={auth.user.avatar} size="big-avatar" />

      <button
        className="statusBtn flex-fill px-3"
        onClick={() => dispatch({ type: GLOBALTYPES.STATUS, payload: true })}
      >
        Share your thoughts, photos, or what's happening...
      </button>
    </div>
  );
};

export default Status;
